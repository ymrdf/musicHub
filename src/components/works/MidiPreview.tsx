"use client";

import { useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";

interface MidiPreviewProps {
  filePath: string;
  fileName: string;
  fileSize: number;
}

export default function MidiPreview({
  filePath,
  fileName,
  fileSize,
}: MidiPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handlePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      // 创建一个临时的audio元素来播放MIDI文件
      // 注意：浏览器原生不支持MIDI播放，这里提供一个下载链接
      // 在实际应用中，可能需要使用Web MIDI API或第三方库
      const audio = new Audio(filePath);

      // 由于浏览器不支持直接播放MIDI，我们显示一个提示
      alert("浏览器不支持直接播放MIDI文件，请下载后使用专业软件播放");
      setIsPlaying(false);
    } catch (error) {
      console.error("播放失败:", error);
      alert("播放失败，请下载文件后使用专业软件播放");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MusicalNoteIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            MIDI 文件预览
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatFileSize(fileSize)}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            点击下载后使用专业软件播放
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
            ) : isPlaying ? (
              <PauseIcon className="h-4 w-4 mr-1" />
            ) : (
              <PlayIcon className="h-4 w-4 mr-1" />
            )}
            {isPlaying ? "停止" : "试听"}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            下载
          </button>
        </div>
      </div>

      {/* MIDI文件信息提示 */}
      <div className="mt-3 p-3 bg-blue-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <MusicalNoteIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>提示：</strong>MIDI文件需要专业的音乐软件才能播放，如：
              <br />
              • Windows: Windows Media Player, VLC, MuseScore
              <br />
              • macOS: QuickTime Player, GarageBand, Logic Pro
              <br />• 在线: Online MIDI Player, MIDI.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
