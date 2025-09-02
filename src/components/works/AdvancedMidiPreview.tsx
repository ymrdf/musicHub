"use client";

import { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  MusicalNoteIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import MidiPlayerModal from "./MidiPlayerModal";

interface AdvancedMidiPreviewProps {
  filePath: string;
  fileName: string;
  fileSize: number;
}

export default function AdvancedMidiPreview({
  filePath,
  fileName,
  fileSize,
}: AdvancedMidiPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handlePlay = () => {
    setShowPlayerModal(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MusicalNoteIcon className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            MIDI 文件预览
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
          <p className="text-xs text-gray-500 mt-1">专业音乐文件格式</p>
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
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
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

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* 播放建议 */}
      <div className="bg-white/70 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <MusicalNoteIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              <strong>推荐播放软件：</strong>
            </p>
            <div className="mt-1 text-xs text-gray-600 space-y-1">
              <div>
                • <strong>免费软件：</strong>VLC Media Player, Windows Media
                Player
              </div>
              <div>
                • <strong>专业软件：</strong>MuseScore, Logic Pro, Cubase
              </div>
              <div>
                • <strong>在线播放：</strong>Online MIDI Player, MIDI.js
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDI播放器模态框 */}
      <MidiPlayerModal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        filePath={filePath}
        fileName={fileName}
        fileSize={fileSize}
      />
    </div>
  );
}
