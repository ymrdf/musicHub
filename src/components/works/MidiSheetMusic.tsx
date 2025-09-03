"use client";

import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { DocumentIcon } from "@heroicons/react/24/outline";

interface MidiSheetMusicProps {
  midiData: Midi | null;
  filePath: string;
}

export default function MidiSheetMusic({
  midiData,
  filePath,
}: MidiSheetMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [musicXml, setMusicXml] = useState<string | null>(null);

  // 将MIDI数据转换为MusicXML格式
  const convertMidiToMusicXml = async (midi: Midi) => {
    try {
      // 这里是一个简单的MusicXML模板开头
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">`;

      // 处理MIDI音符
      interface MidiNote {
        name: string;
        octave: number;
        time: number;
        duration: number;
        velocity: number;
      }

      const notes: MidiNote[] = [];

      // 收集所有音符
      midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
          notes.push({
            name: note.name,
            octave: note.octave,
            time: note.time,
            duration: note.duration,
            velocity: note.velocity,
          });
        });
      });

      // 按时间排序
      notes.sort((a, b) => a.time - b.time);

      // 增加音符数量限制，显示更多的音符
      const maxNotes = 400; // 增加到400个音符
      const notesToRender = notes.slice(0, maxNotes);

      // 确定每个小节的音符数量
      const notesPerMeasure = 16; // 每小节16个音符
      const measuresCount = Math.ceil(notesToRender.length / notesPerMeasure);

      // 生成多个小节
      for (let measureIndex = 0; measureIndex < measuresCount; measureIndex++) {
        const measureNumber = measureIndex + 1;

        // 开始一个新的小节
        xml += `
    <measure number="${measureNumber}">`;

        // 只在第一个小节添加属性
        if (measureIndex === 0) {
          xml += `
      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>`;
        }

        // 获取当前小节的音符
        const startIdx = measureIndex * notesPerMeasure;
        const endIdx = Math.min(
          (measureIndex + 1) * notesPerMeasure,
          notesToRender.length
        );
        const measureNotes = notesToRender.slice(startIdx, endIdx);

        // 将音符转换为MusicXML格式
        measureNotes.forEach((note) => {
          const step = note.name.charAt(0).toUpperCase();
          const alter = note.name.includes("#")
            ? 1
            : note.name.includes("b")
            ? -1
            : 0;
          const octave = note.octave;
          const duration = Math.round(note.duration * 4); // 假设四分音符为1拍

          // 确保持续时间不为零
          const safeDuration = duration > 0 ? duration : 1;

          xml += `
      <note>
        <pitch>
          <step>${step}</step>
          ${alter !== 0 ? `<alter>${alter}</alter>` : ""}
          <octave>${octave}</octave>
        </pitch>
        <duration>${safeDuration}</duration>
        <type>${getDurationType(safeDuration)}</type>
      </note>`;
        });

        // 结束当前小节
        xml += `
    </measure>`;
      }

      // 结束XML文档
      xml += `
  </part>
</score-partwise>`;

      return xml;
    } catch (error) {
      console.error("转换MIDI到MusicXML失败:", error);
      throw new Error("转换MIDI到MusicXML失败");
    }
  };

  // 根据持续时间获取音符类型
  const getDurationType = (duration: number) => {
    if (duration >= 16) return "whole";
    if (duration >= 8) return "half";
    if (duration >= 4) return "quarter";
    if (duration >= 2) return "eighth";
    return "16th";
  };

  // 初始化OpenSheetMusicDisplay
  const initializeOSMD = async () => {
    if (!containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // 如果已经有OSMD实例，先销毁它
      if (osmdRef.current) {
        osmdRef.current.clear();
      }

      // 创建新的OSMD实例，优化显示配置
      const osmd = new OpenSheetMusicDisplay(containerRef.current, {
        autoResize: true,
        drawTitle: true,
        drawSubtitle: true,
        drawComposer: true,
        drawCredits: true,
        // 优化乐谱显示
        pageBackgroundColor: "#FFFFFF",
        defaultFontFamily: "Arial",
        followCursor: true, // 启用光标跟踪
        newSystemFromXML: true, // 从XML中获取系统换行信息
        newPageFromXML: true, // 从XML中获取分页信息
      });
      osmdRef.current = osmd;

      // 如果已有MusicXML数据，直接加载
      if (musicXml) {
        await osmd.load(musicXml);
        await osmd.render();
      }
      // 如果有MIDI数据，先转换再加载
      else if (midiData) {
        const xml = await convertMidiToMusicXml(midiData);
        setMusicXml(xml);
        await osmd.load(xml);
        await osmd.render();
      }
      // 如果只有文件路径，先加载MIDI文件
      else if (filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const midi = new Midi(arrayBuffer);

        const xml = await convertMidiToMusicXml(midi);
        setMusicXml(xml);
        await osmd.load(xml);
        await osmd.render();
      }
    } catch (error: any) {
      console.error("初始化乐谱显示失败:", error);
      setError("乐谱加载失败: " + (error.message || String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 当组件挂载或midiData/filePath变化时初始化OSMD
  useEffect(() => {
    initializeOSMD();

    // 清理函数
    return () => {
      if (osmdRef.current) {
        osmdRef.current.clear();
      }
    };
  }, [midiData, filePath]);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DocumentIcon className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">MIDI 乐谱</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full overflow-auto border border-gray-100 rounded-md"
          style={{ minHeight: "500px", maxHeight: "70vh", padding: "20px" }}
        />
      )}
    </div>
  );
}
