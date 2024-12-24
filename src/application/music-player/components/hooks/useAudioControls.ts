import { useCallback, useMemo, useState } from "react";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";

export type RepeatType = "none" | "all" | "one";

export function useAudioControls() {
  const {
    audioRef,
    currentTrack,
    setCurrentTrack,
    setIsPlaying,
    trackList,
    trackIndex,
    duration,
    setDuration,
    progressBarRef,
  } = useAudioPlayerContext();
  const currentAudioRef = audioRef.current;

  const [repeatType, setRepeatType] = useState<RepeatType>("none");

  const onLoadedMetadata = useCallback(() => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      if (seconds === duration) {
        // hack for a bug where two songs with same duration will cause player to pause when switching
        setDuration(0);
        setTimeout(() => setDuration(seconds));
      } else {
        setDuration(seconds);
      }
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  }, [audioRef, duration, progressBarRef, setDuration]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      setCurrentTrack(trackList[0]);
    }
    setIsPlaying((prev) => !prev);
  }, [currentTrack, setCurrentTrack, setIsPlaying, trackList]);

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
      setCurrentTrack(trackList[trackList.length - 1]);
      return;
    }
    setCurrentTrack(() => trackList[Math.max(trackIndex - 1, 0)]);
  }, [repeatType, setCurrentTrack, trackIndex, trackList]);

  const nextTrack = useCallback(() => {
    if (repeatType === "one") {
      repeatSong();
      return;
    }

    const isLastTrack = trackIndex === trackList.length - 1;
    if (isLastTrack && repeatType === "all") {
      setCurrentTrack(trackList[0]);
      return;
    } else if (isLastTrack) {
      return;
    }

    setCurrentTrack(
      () => trackList[Math.min(trackIndex + 1, trackList.length - 1)]
    );
  }, [repeatSong, repeatType, setCurrentTrack, trackIndex, trackList]);

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
