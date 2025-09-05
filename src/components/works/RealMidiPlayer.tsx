"use client";

import { useState, useEffect, useRef } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import MidiSheetModal from "./MidiSheetModal";

interface RealMidiPlayerProps {
  filePath: string;
  fileName: string;
  fileSize: number;
}

export default function RealMidiPlayer({
  filePath,
  fileName,
  fileSize,
}: RealMidiPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  const synthRef = useRef<Tone.PolySynth | null>(null);
  const synthsRef = useRef<Tone.PolySynth[]>([]);
  const transportRef = useRef<any | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const partRef = useRef<Tone.Part | null>(null);

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 初始化音频上下文和合成器
  const initializeAudio = async () => {
    try {
      if (!isInitialized) {
        console.log("Initializing audio context...");

        // 确保用户交互后才启动音频上下文
        try {
          await Tone.start();
          console.log("Audio context started, state:", Tone.context.state);
        } catch (e) {
          console.error("Failed to start Tone.js audio context:", e);
          setError("需要用户交互才能启动音频。请再次点击播放按钮。");
          return; // 如果无法启动音频上下文，直接返回
        }

        if (Tone.context.state !== "running") {
          console.warn(
            "Audio context not running after start:",
            Tone.context.state
          );
          setError("浏览器音频上下文未能正常启动。请再次点击播放按钮。");
          return;
        }

        // 创建多个合成器，用于不同音色
        const synths = [];

        // 主旋律合成器
        const melodySynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: "sine", // 使用正弦波，更柔和的音色
          },
          envelope: {
            attack: 0.01, // 立刻出来
            decay: 0.3, // 稍快衰减
            sustain: 0.2, // 保持音量较小
            release: 0.4, // 松开后很快消失
          },
          volume: -6, // 降低音量
        }).toDestination();
        synths.push(melodySynth);

        // 低音合成器
        const bassSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: "triangle", // 三角波，适合低音
          },
          envelope: {
            attack: 0.02,
            decay: 0.15,
            sustain: 0.4,
            release: 0.8,
          },
          volume: -8, // 音量稍低
        }).toDestination();
        synths.push(bassSynth);

        // 和弦合成器
        const chordSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: "sine4", // 更丰富的正弦波
          },
          envelope: {
            attack: 0.03,
            decay: 0.2,
            sustain: 0.3,
            release: 1.0,
          },
          volume: -10, // 音量更低，作为背景
        }).toDestination();
        synths.push(chordSynth);

        // 保存所有合成器
        synthsRef.current = synths;

        // 使用第一个合成器作为默认
        synthRef.current = melodySynth;

        console.log("Synth created:", synthRef.current);

        // 设置音量
        synthRef.current.volume.value = Tone.gainToDb(volume);
        console.log("Volume set to:", synthRef.current.volume.value);

        // 获取传输对象
        transportRef.current = Tone.Transport;
        console.log("Transport obtained:", transportRef.current);

        // 初始化合成器完成
        console.log("Synth initialized successfully");

        setIsInitialized(true);
        console.log("Audio initialized successfully");
      }
    } catch (error: any) {
      console.error("Failed to initialize audio:", error);
      setError(
        "音频初始化失败，请检查浏览器权限: " + (error.message || String(error))
      );
    }
  };

  // 只加载MIDI文件元数据，不初始化音频
  const loadMidiMetadata = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Loading MIDI metadata from:", filePath);

      // 获取MIDI文件
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log("MIDI file loaded, size:", arrayBuffer.byteLength, "bytes");

      const midi = new Midi(arrayBuffer);
      console.log("MIDI parsed successfully");

      setMidiData(midi);
      setDuration(midi.duration);

      console.log("MIDI metadata loaded successfully:", {
        duration: midi.duration,
        tracks: midi.tracks.length,
        name: midi.name,
      });

      // 打印每个音轨的详细信息
      midi.tracks.forEach((track, index) => {
        console.log(`Track ${index}:`, {
          name: track.name,
          notes: track.notes.length,
          instruments: track.instrument.name,
          firstNote: track.notes[0]
            ? {
                name: track.notes[0].name,
                octave: track.notes[0].octave,
                time: track.notes[0].time,
                duration: track.notes[0].duration,
              }
            : null,
        });
      });
    } catch (error: any) {
      console.error("Failed to load MIDI metadata:", error);
      setError(
        "MIDI文件加载失败，请检查文件格式: " + (error.message || String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 完整加载MIDI文件（包括初始化音频）
  const loadMidiFile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Loading MIDI file with audio from:", filePath);

      // 初始化音频
      await initializeAudio();

      // 如果已经加载了元数据，不需要重新加载
      if (!midiData) {
        // 获取MIDI文件
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("MIDI file loaded, size:", arrayBuffer.byteLength, "bytes");

        const midi = new Midi(arrayBuffer);
        console.log("MIDI parsed successfully");

        setMidiData(midi);
        setDuration(midi.duration);

        console.log("MIDI loaded successfully:", {
          duration: midi.duration,
          tracks: midi.tracks.length,
          name: midi.name,
        });
      } else {
        console.log("Using already loaded MIDI data");
      }
    } catch (error: any) {
      console.error("Failed to load MIDI with audio:", error);
      setError(
        "MIDI文件加载失败，请检查文件格式或浏览器权限: " +
          (error.message || String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 播放MIDI
  const playMidi = async () => {
    console.log("playMidi called, isPlaying:", isPlaying);
    console.log("midiData:", midiData);
    console.log("synthRef.current:", synthRef.current);
    console.log("transportRef.current:", transportRef.current);

    // 检查是否已初始化音频
    if (!isInitialized) {
      console.log("Audio not initialized, initializing now...");
      try {
        // 显示加载状态
        setIsLoading(true);

        // 初始化音频并加载MIDI
        await loadMidiFile();

        // 初始化成功后不再递归调用，而是继续执行
        setIsLoading(false);

        // 如果初始化成功但仍然缺少必要组件，直接返回
        if (!midiData || !synthRef.current || !transportRef.current) {
          console.log("Audio initialized but still missing dependencies");
          return;
        }

        // 继续执行，不要递归调用
      } catch (error) {
        console.error("Failed to initialize audio:", error);
        setIsLoading(false);
        return;
      }
    } else if (!midiData || !synthRef.current || !transportRef.current) {
      // 已初始化但缺少其他依赖
      console.log("Audio initialized but missing other dependencies");
      try {
        await loadMidiFile();
        if (!midiData || !synthRef.current || !transportRef.current) {
          return; // 仍然缺少依赖，无法继续
        }
      } catch (error) {
        console.error("Failed to load MIDI:", error);
        return;
      }
    }

    try {
      if (isPlaying) {
        // 暂停
        console.log("Pausing playback...");
        transportRef.current.pause();
        setIsPlaying(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // 清除进度更新定时器
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        // 播放
        console.log("Starting playback...");
        console.log("Transport state:", transportRef.current.state);

        // 检查是否是从暂停状态恢复播放
        if (
          transportRef.current.state !== "started" &&
          transportRef.current.state !== "stopped"
        ) {
          console.log("Resuming from pause...");
          transportRef.current.start();
          setIsPlaying(true);
          updateProgress();

          // 设置进度更新定时器
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          progressIntervalRef.current = setInterval(() => {
            if (transportRef.current && isPlaying) {
              const currentSeconds = transportRef.current.seconds || 0;
              setCurrentTime((prev) => {
                if (Math.abs(prev - currentSeconds) > 0.01) {
                  return currentSeconds;
                }
                return prev;
              });
            } else if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }, 50);

          return;
        }

        // 如果不是从暂停状态恢复，则重新开始播放
        console.log("Starting new playback...");

        // 重新调度音符，确保播放
        transportRef.current.cancel();
        transportRef.current.stop();

        // 重置Transport时间到0
        transportRef.current.seconds = 0;
        console.log("Transport time reset to 0");

        // 设置所有合成器的音量
        if (synthsRef.current.length > 0) {
          synthsRef.current.forEach((synth, index) => {
            const volumeOffset = index === 0 ? 0 : index === 1 ? -2 : -4;
            synth.volume.value = isMuted
              ? -Infinity
              : Tone.gainToDb(volume) + volumeOffset;
          });
          console.log("Volume set for all synths");
        } else if (synthRef.current) {
          synthRef.current.volume.value = isMuted
            ? -Infinity
            : Tone.gainToDb(volume);
          console.log("Volume set to:", synthRef.current.volume.value);
        }

        // 使用Tone.Part来调度音符（更可靠的方式）
        let noteCount = 0;
        const allNotes: any[] = [];

        // 找到第一个音符的时间，用于时间偏移
        let firstNoteTime = Infinity;
        midiData.tracks.forEach((track) => {
          track.notes.forEach((note) => {
            if (note.time < firstNoteTime) {
              firstNoteTime = note.time;
            }
          });
        });

        console.log(`First note time: ${firstNoteTime} seconds`);

        midiData.tracks.forEach((track, trackIndex) => {
          console.log(`Track ${trackIndex}:`, track.notes.length, "notes");
          track.notes.forEach((note, noteIndex) => {
            if (noteIndex < 10) {
              // 只打印前10个音符用于调试
              console.log(`Note ${noteIndex}:`, {
                name: note.name,
                octave: note.octave,
                time: note.time,
                adjustedTime: note.time - firstNoteTime,
                duration: note.duration,
                velocity: note.velocity,
              });
            }

            // 收集所有音符，调整时间从0开始
            allNotes.push({
              time: note.time - firstNoteTime, // 时间偏移，从0开始
              note: note.name, // 正确格式化为 "C4" 这样的格式
              duration: note.duration,
              velocity: note.velocity * 0.8, // 降低音符力度，使声音更柔和
              track: trackIndex, // 添加音轨信息
            });
            noteCount++;
          });
        });

        console.log(`Total notes collected: ${noteCount}`);

        // 对音符进行排序，确保按时间顺序播放
        allNotes.sort((a, b) => a.time - b.time);

        // 限制音符数量以避免性能问题
        const maxNotes = 3000; // 增加到3000个音符，提供更完整的播放体验
        const notesToPlay = allNotes.slice(0, maxNotes);

        if (allNotes.length > maxNotes) {
          console.log(
            `Warning: MIDI file has ${allNotes.length} notes, limiting to ${maxNotes} for performance`
          );
        }

        console.log(
          "音符分布情况:",
          notesToPlay.reduce((acc, note) => {
            acc[note.track] = (acc[note.track] || 0) + 1;
            return acc;
          }, {})
        );

        // 创建Part对象来播放音符
        partRef.current = new Tone.Part((time, noteData) => {
          // 根据音轨选择不同的合成器
          const synthIndex = noteData.track % synthsRef.current.length;
          const synth = synthsRef.current[synthIndex];

          // 每次播放音符时，更新当前时间
          if (transportRef.current) {
            // 使用setTimeout确保在主线程更新UI
            setTimeout(() => {
              const currentSeconds = transportRef.current?.seconds || 0;
              setCurrentTime(currentSeconds);
            }, 0);
          }

          console.log(
            `Playing note: ${noteData.note} at time ${time} on track ${noteData.track} with synth ${synthIndex}`
          );
          synth.triggerAttackRelease(
            noteData.note,
            noteData.duration,
            time,
            noteData.velocity
          );
        }, notesToPlay);

        // 启动Part
        partRef.current.start(0);
        console.log("Part started at time 0");

        // 启动传输
        transportRef.current.start();
        setIsPlaying(true);
        console.log("Transport started, isPlaying set to true");

        // 确保当前时间从0开始
        transportRef.current.seconds = 0;
        setCurrentTime(0);

        // 开始更新进度
        updateProgress();

        // 设置一个定时器，每50毫秒检查一次进度，确保UI更新
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        progressIntervalRef.current = setInterval(() => {
          if (transportRef.current && isPlaying) {
            // 直接从Transport获取当前时间并强制更新状态
            const currentSeconds = transportRef.current.seconds || 0;
            console.log("定时更新进度:", currentSeconds, "秒");
            // 使用函数形式的setState确保基于最新状态更新
            setCurrentTime((prev) => {
              // 只有当新值与旧值不同时才更新
              if (Math.abs(prev - currentSeconds) > 0.01) {
                return currentSeconds;
              }
              return prev;
            });
          } else if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }, 50);
      }
    } catch (error: any) {
      console.error("Playback error:", error);
      setError("播放失败，请重试: " + (error.message || String(error)));
    }
  };

  // 停止播放
  const stopMidi = () => {
    if (transportRef.current) {
      transportRef.current.stop();
      transportRef.current.cancel();
      setCurrentTime(0);
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    // 清除进度更新定时器
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // 停止Part
    if (partRef.current) {
      partRef.current.stop();
      partRef.current.dispose();
      partRef.current = null;
    }
  };

  // 更新播放进度
  const updateProgress = () => {
    if (transportRef.current && isPlaying) {
      // 获取当前时间并强制更新状态
      const currentSeconds = transportRef.current.seconds || 0;
      setCurrentTime(currentSeconds);
      console.log("更新进度:", currentSeconds, "秒");

      // 继续请求动画帧
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  // 跳转到指定时间
  const seekTo = (time: number) => {
    if (transportRef.current && midiData) {
      transportRef.current.seconds = time;
      setCurrentTime(time);
    }
  };

  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  // 音量控制
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    // 设置所有合成器的音量
    if (synthsRef.current.length > 0) {
      synthsRef.current.forEach((synth) => {
        if (!isMuted) {
          // 为不同类型的合成器设置稍微不同的音量
          const index = synthsRef.current.indexOf(synth);
          const volumeOffset = index === 0 ? 0 : index === 1 ? -2 : -4;
          synth.volume.value = Tone.gainToDb(newVolume) + volumeOffset;
        }
      });
    } else if (synthRef.current) {
      synthRef.current.volume.value = Tone.gainToDb(newVolume);
    }
  };

  // 静音切换
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthsRef.current.length > 0) {
      // 设置所有合成器的音量
      synthsRef.current.forEach((synth) => {
        synth.volume.value = isMuted ? Tone.gainToDb(volume) : -Infinity;
      });
    } else if (synthRef.current) {
      synthRef.current.volume.value = isMuted
        ? Tone.gainToDb(volume)
        : -Infinity;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (transportRef.current) {
        transportRef.current.stop();
        transportRef.current.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (partRef.current) {
        partRef.current.stop();
        partRef.current.dispose();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  // 仅加载MIDI文件元数据，不初始化音频
  useEffect(() => {
    loadMidiMetadata();
  }, [filePath]);

  // 计算进度百分比，确保值在0-100之间
  const progressPercent =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  // 调试输出进度信息
  useEffect(() => {
    if (isPlaying) {
      console.log(
        `进度更新: ${currentTime.toFixed(2)}秒 / ${duration.toFixed(
          2
        )}秒 (${progressPercent.toFixed(1)}%)`
      );
    }
  }, [currentTime, isPlaying, duration, progressPercent]);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MusicalNoteIcon className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-900">
            真实 MIDI 播放器
          </span>
        </div>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {formatFileSize(fileSize)}
        </span>
      </div>

      <div className="flex items-center space-x-3 mb-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm text-gray-700 truncate font-medium"
            title={fileName}
          >
            {fileName}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {midiData ? `${midiData.tracks.length} 个音轨` : "加载中..."}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* 音量控制 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleMute}
              className="p-1 rounded-full hover:bg-white/50 transition-colors"
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <SpeakerWaveIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* 播放控制 */}
          <button
            onClick={playMidi}
            disabled={isLoading || !midiData}
            className="inline-flex items-center px-3 py-1.5 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-1"></div>
            ) : isPlaying ? (
              <PauseIcon className="h-4 w-4 mr-1" />
            ) : (
              <PlayIcon className="h-4 w-4 mr-1" />
            )}
            {isLoading ? "加载中" : isPlaying ? "暂停" : "播放"}
          </button>

          <button
            onClick={stopMidi}
            disabled={!midiData}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <StopIcon className="h-4 w-4 mr-1" />
            停止
          </button>

          <button
            onClick={() => setIsSheetModalOpen(true)}
            disabled={!midiData}
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            乐谱
          </button>
        </div>
      </div>

      {/* 进度条 */}
      {midiData && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-500 font-mono w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  transition: "width 0.1s linear",
                }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full shadow-sm cursor-pointer"
                style={{
                  left: `calc(${progressPercent}% - 6px)`,
                  transition: "left 0.1s linear",
                }}
              />
            </div>
            <span className="text-xs text-gray-500 font-mono w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* 成功提示 */}
      {midiData && !error && (
        <div
          className={`${
            isInitialized
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200"
          } border rounded-md p-3`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <MusicalNoteIcon
                className={`h-5 w-5 ${
                  isInitialized ? "text-green-500" : "text-blue-500"
                }`}
              />
            </div>
            <div className="ml-3">
              <p
                className={`text-sm ${
                  isInitialized ? "text-green-700" : "text-blue-700"
                }`}
              >
                <strong>
                  {isInitialized ? "MIDI 文件加载成功！" : "MIDI 元数据已加载"}
                </strong>
              </p>
              <p
                className={`text-xs ${
                  isInitialized ? "text-green-600" : "text-blue-600"
                } mt-1`}
              >
                音轨数: {midiData.tracks.length} | 时长: {formatTime(duration)}{" "}
                {isInitialized
                  ? "| 使用 Tone.js 引擎播放"
                  : "| 点击播放按钮初始化音频"}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* 乐谱弹窗 */}
      <MidiSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        filePath={filePath}
        fileName={fileName}
        midiData={midiData}
      />
    </div>
  );
}
