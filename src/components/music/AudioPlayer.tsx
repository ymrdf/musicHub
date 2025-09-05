"use client";

import { useState, useEffect } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { ArrowPathIcon as ArrowPathSolidIcon } from "@heroicons/react/24/solid";

export function AudioPlayer() {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    currentPerformance,
    playlist,
    currentIndex,
    isRepeat,
    isRandom,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    toggleMute,
    next,
    previous,
    toggleRepeat,
    toggleRandom,
  } = useAudioPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 如果没有当前播放的演奏，不显示播放器
  if (!currentPerformance) {
    return null;
  }

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !duration) return;

    // 阻止事件冒泡，防止其他事件处理程序干扰
    e.stopPropagation();
    e.preventDefault();

    // 计算点击位置对应的时间
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const newTime = percent * duration;

    // 确保时间在有效范围内
    if (
      !isNaN(newTime) &&
      isFinite(newTime) &&
      newTime >= 0 &&
      newTime <= duration
    ) {
      // 使用 requestAnimationFrame 确保 UI 更新后再调用 seekTo
      requestAnimationFrame(() => {
        seekTo(newTime);
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* 主播放器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* 当前播放信息 */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-primary-100 rounded-md flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                ) : (
                  <PlayIcon className="h-5 w-5 text-primary-600" />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentPerformance.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentPerformance.user?.username} •{" "}
                {currentPerformance.instrument}
              </p>
            </div>
          </div>

          {/* 播放控制 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={previous}
              disabled={playlist.length <= 1}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <BackwardIcon className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={() => (isPlaying ? pause() : play())}
              disabled={isLoading}
              className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={next}
              disabled={playlist.length <= 1}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ForwardIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* 进度条 */}
          <div className="flex items-center space-x-3 flex-1 min-w-0 mx-6">
            <span className="text-xs text-gray-500 font-mono w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <div
              className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-600 rounded-full shadow-sm cursor-pointer"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            </div>

            <span className="text-xs text-gray-500 font-mono w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* 音量和其他控制 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleRepeat}
              className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                isRepeat ? "text-primary-600" : "text-gray-500"
              }`}
            >
              {isRepeat ? (
                <ArrowPathSolidIcon className="h-4 w-4" />
              ) : (
                <ArrowPathIcon className="h-4 w-4" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
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
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <QueueListIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* 展开的播放列表 */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              播放列表 ({playlist.length} 首)
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {playlist.map((performance, index) => (
                <div
                  key={performance.id}
                  className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                    index === currentIndex
                      ? "bg-primary-50 border border-primary-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (index !== currentIndex) {
                      play(performance);
                    }
                  }}
                >
                  <div className="flex-shrink-0 w-6 text-center">
                    {index === currentIndex && isPlaying ? (
                      <div className="wave-animation">
                        <div className="wave-bar h-2"></div>
                        <div className="wave-bar h-3"></div>
                        <div className="wave-bar h-2"></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {performance.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {performance.user?.username} • {performance.instrument}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500">
                    {performance.duration
                      ? formatTime(performance.duration)
                      : "--:--"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 自定义样式 */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .wave-animation {
          display: inline-flex;
          align-items: center;
          gap: 1px;
        }

        .wave-bar {
          width: 2px;
          background-color: #0ea5e9;
          animation: wave 1.2s ease-in-out infinite;
        }

        .wave-bar:nth-child(1) {
          animation-delay: 0s;
        }
        .wave-bar:nth-child(2) {
          animation-delay: 0.1s;
        }
        .wave-bar:nth-child(3) {
          animation-delay: 0.2s;
        }

        @keyframes wave {
          0%,
          40%,
          100% {
            height: 4px;
          }
          20% {
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
}
