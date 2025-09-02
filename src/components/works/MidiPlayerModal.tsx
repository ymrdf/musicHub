"use client";

import { useState } from "react";
import {
  XMarkIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

interface MidiPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  fileSize: number;
}

export default function MidiPlayerModal({
  isOpen,
  onClose,
  filePath,
  fileName,
  fileSize,
}: MidiPlayerModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const playOptions = [
    {
      id: "download",
      title: "下载文件",
      description: "下载到本地，使用专业软件播放",
      icon: ArrowDownTrayIcon,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        const link = document.createElement("a");
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
      },
    },
    {
      id: "online",
      title: "在线播放器",
      description: "使用在线MIDI播放器播放",
      icon: GlobeAltIcon,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const onlinePlayerUrl = `https://onlinesequencer.net/import?url=${encodeURIComponent(
          window.location.origin + filePath
        )}`;
        window.open(onlinePlayerUrl, "_blank");
        onClose();
      },
    },
    {
      id: "system",
      title: "系统播放器",
      description: "使用系统默认播放器",
      icon: ComputerDesktopIcon,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => {
        window.open(filePath, "_blank");
        onClose();
      },
    },
    {
      id: "mobile",
      title: "移动端播放",
      description: "在移动设备上播放",
      icon: DevicePhoneMobileIcon,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => {
        // 移动端通常需要下载
        const link = document.createElement("a");
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MusicalNoteIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                MIDI 文件播放
              </h3>
              <p className="text-sm text-gray-500">
                {fileName} ({formatFileSize(fileSize)})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <MusicalNoteIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">
                  关于 MIDI 播放
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  MIDI 文件包含音乐数据而非音频波形，需要音源库才能播放。
                  浏览器无法直接播放 MIDI 文件，请选择以下方式之一：
                </p>
              </div>
            </div>
          </div>

          {/* 播放选项 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.action}
                  className={`${option.color} text-white p-4 rounded-lg transition-colors text-left`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-6 w-6 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-sm opacity-90 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 推荐软件 */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              推荐播放软件
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-1">免费软件</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• VLC Media Player</li>
                  <li>• Windows Media Player</li>
                  <li>• QuickTime Player (macOS)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-1">专业软件</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• MuseScore</li>
                  <li>• Logic Pro (macOS)</li>
                  <li>• Cubase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
