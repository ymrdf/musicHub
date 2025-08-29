"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Performance, AudioPlayerState } from "@/types";

interface AudioPlayerContextType extends AudioPlayerState {
  play: (performance?: Performance) => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  next: () => void;
  previous: () => void;
  toggleRepeat: () => void;
  toggleRandom: () => void;
  setPlaylist: (playlist: Performance[], startIndex?: number) => void;
  addToPlaylist: (performance: Performance) => void;
  removeFromPlaylist: (performanceId: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isLoading: false,
    currentPerformance: undefined,
    playlist: [],
    currentIndex: -1,
    isRepeat: false,
    isRandom: false,
  });

  // 辅助函数
  const getNextIndex = (
    currentIndex: number,
    playlistLength: number
  ): number => {
    if (playlistLength === 0) return -1;
    if (state.isRandom) {
      return Math.floor(Math.random() * playlistLength);
    }
    return (currentIndex + 1) % playlistLength;
  };

  const getPreviousIndex = (
    currentIndex: number,
    playlistLength: number
  ): number => {
    if (playlistLength === 0) return -1;
    if (state.isRandom) {
      return Math.floor(Math.random() * playlistLength);
    }
    return currentIndex <= 0 ? playlistLength - 1 : currentIndex - 1;
  };

  const next = () => {
    if (state.playlist.length === 0) return;

    if (state.isRepeat && state.currentPerformance) {
      // 重复播放当前歌曲
      play(state.currentPerformance);
      return;
    }

    const nextIndex = getNextIndex(state.currentIndex, state.playlist.length);
    const nextPerformance = state.playlist[nextIndex];

    if (nextPerformance) {
      setState((prev) => ({ ...prev, currentIndex: nextIndex }));
      play(nextPerformance);
    }
  };

  const previous = () => {
    if (state.playlist.length === 0) return;

    const prevIndex = getPreviousIndex(
      state.currentIndex,
      state.playlist.length
    );
    const prevPerformance = state.playlist[prevIndex];

    if (prevPerformance) {
      setState((prev) => ({ ...prev, currentIndex: prevIndex }));
      play(prevPerformance);
    }
  };

  // 初始化音频元素
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleLoadStart = () => {
      setState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration || 0,
        isLoading: false,
      }));
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      // 自动播放下一首
      next();
    };

    const handleError = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
      }));
      console.error("音频播放错误");
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, []);

  const play = (performance?: Performance) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (performance) {
      // 播放新的音频
      setState((prev) => ({
        ...prev,
        currentPerformance: performance,
        isLoading: true,
      }));

      audio.src = performance.audioFilePath;
      audio.load();

      audio.addEventListener(
        "canplay",
        () => {
          audio
            .play()
            .then(() => {
              setState((prev) => ({ ...prev, isPlaying: true }));
            })
            .catch((error) => {
              console.error("播放失败:", error);
              setState((prev) => ({ ...prev, isLoading: false }));
            });
        },
        { once: true }
      );
    } else {
      // 继续播放当前音频
      audio
        .play()
        .then(() => {
          setState((prev) => ({ ...prev, isPlaying: true }));
        })
        .catch((error) => {
          console.error("播放失败:", error);
        });
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setState((prev) => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audio.volume = clampedVolume;
    setState((prev) => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !state.isMuted;
    audio.muted = newMutedState;
    setState((prev) => ({ ...prev, isMuted: newMutedState }));
  };

  const toggleRepeat = () => {
    setState((prev) => ({ ...prev, isRepeat: !prev.isRepeat }));
  };

  const toggleRandom = () => {
    setState((prev) => ({ ...prev, isRandom: !prev.isRandom }));
  };

  const setPlaylist = (playlist: Performance[], startIndex = 0) => {
    setState((prev) => ({
      ...prev,
      playlist,
      currentIndex: startIndex,
    }));

    if (
      playlist.length > 0 &&
      startIndex >= 0 &&
      startIndex < playlist.length
    ) {
      play(playlist[startIndex]);
    }
  };

  const addToPlaylist = (performance: Performance) => {
    setState((prev) => {
      const newPlaylist = [...prev.playlist, performance];
      return { ...prev, playlist: newPlaylist };
    });
  };

  const removeFromPlaylist = (performanceId: number) => {
    setState((prev) => {
      const newPlaylist = prev.playlist.filter((p) => p.id !== performanceId);
      const newCurrentIndex =
        prev.currentIndex >= newPlaylist.length
          ? Math.max(0, newPlaylist.length - 1)
          : prev.currentIndex;

      return {
        ...prev,
        playlist: newPlaylist,
        currentIndex: newCurrentIndex,
      };
    });
  };

  const contextValue: AudioPlayerContextType = {
    ...state,
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
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
