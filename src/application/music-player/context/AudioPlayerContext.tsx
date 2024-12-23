import { RefObject, createContext, useContext } from "react";
import { ChangeHandler } from "../../../types";

export interface Track {
  title: string;
  src: string;
  author: string;
}

interface AudioPlayerContext {
  trackIndex: number;
  setTrackIndex: ChangeHandler<number>;
  currentTrack?: Track;
  trackList: Track[];
  setTrackList: ChangeHandler<Track[]>;
  showTrackList: boolean;
  setShowTrackList: ChangeHandler<boolean>;
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
  currentTime: number;
  setCurrentTime: ChangeHandler<number>;
  duration: number;
  setDuration: ChangeHandler<number>;
  isPlaying: boolean;
  setIsPlaying: ChangeHandler<boolean>;
  volume: number;
  setVolume: ChangeHandler<number>;
  showAddTrack: boolean;
  setShowAddTrack: ChangeHandler<boolean>;
}

export const AudioPlayerContext = createContext<AudioPlayerContext | undefined>(
  undefined
);

export function useAudioPlayerContext(): AudioPlayerContext {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioPlayerProvider"
    );
  }
  return context;
}
