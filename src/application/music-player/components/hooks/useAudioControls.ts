import { useCallback, useMemo, useState } from "react";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";

export type RepeatType = "none" | "all" | "one";

export function useAudioControls() {
  const {
    audioRef,
    currentTrack,
    setTrackIndex,
    setIsPlaying,
    trackIndex,
    trackList,
    setDuration,
    progressBarRef,
  } = useAudioPlayerContext();
  const currentAudioRef = audioRef.current;

  const [repeatType, setRepeatType] = useState<RepeatType>("none");

  const onLoadedMetadata = useCallback(() => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  }, [audioRef, progressBarRef, setDuration]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      setTrackIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [currentTrack, setIsPlaying, setTrackIndex]);

  const seek = useCallback(
    (time: number) => {
      if (!currentAudioRef) return;
      currentAudioRef.currentTime += time;
    },
    [currentAudioRef]
  );

  const repeatSong = useCallback(() => {
    if (!currentAudioRef) return;
    currentAudioRef.currentTime = 0;
  }, [currentAudioRef]);

  const prevTrack = useCallback(() => {
    if (trackIndex === 0 && repeatType) {
      setTrackIndex(trackList.length - 1);
      return;
    }
    setTrackIndex((prev) => Math.max(prev - 1, 0));
  }, [repeatType, setTrackIndex, trackIndex, trackList.length]);

  const nextTrack = useCallback(() => {
    if (repeatType === "one") {
      repeatSong();
      return;
    }

    const isLastTrack = trackIndex === trackList.length - 1;
    if (isLastTrack && repeatType === "all") {
      setTrackIndex(0);
      return;
    }

    setTrackIndex((prev) => Math.min(prev + 1, trackList.length - 1));
  }, [repeatSong, repeatType, setTrackIndex, trackIndex, trackList.length]);

  const toggleRepeatType = useCallback(() => {
    setRepeatType((prev) =>
      prev === "none" ? "all" : prev === "all" ? "one" : "none"
    );
  }, []);

  return useMemo(
    () => ({
      onLoadedMetadata,
      togglePlay,
      seek,
      repeatSong,
      prevTrack,
      nextTrack,
      repeatType,
      toggleRepeatType,
    }),
    [
      onLoadedMetadata,
      togglePlay,
      seek,
      repeatSong,
      prevTrack,
      nextTrack,
      repeatType,
      toggleRepeatType,
    ]
  );
}
