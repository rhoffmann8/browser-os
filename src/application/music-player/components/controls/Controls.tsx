import {
  fa1,
  faAdd,
  faBackwardStep,
  faFastBackward,
  faFastForward,
  faForwardStep,
  faList,
  faPause,
  faPlay,
  faRepeat,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, BoxCol } from "../../../../components/Box";
import { IconButton } from "../../../../components/IconButton";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";
import { controlsContainerCss } from "../../styles";
import { getRepeatTypeDisplay } from "../../utils";
import { useAudioControls } from "../hooks/useAudioControls";
import { Volume } from "./Volume";

const SEEK_SECONDS = 15;

export function Controls() {
  const {
    audioRef,
    trackList,
    trackIndex,
    setTrackIndex,
    setCurrentTime,
    progressBarRef,
    duration,
    showTrackList,
    setShowTrackList,
    currentTrack,
    isPlaying,
    volume,
    showAddTrack,
    setShowAddTrack,
  } = useAudioPlayerContext();

  const {
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    repeatType,
    toggleRepeatType,
    onLoadedMetadata,
  } = useAudioControls();

  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (trackIndex === trackList.length - 1 && repeatType === "all") {
          setTrackIndex(0);
        } else if (trackIndex < trackList.length) {
          if (repeatType === "one") {
            currentAudioRef.currentTime = 0;
            currentAudioRef.play();
          } else {
            setTrackIndex((prev) => prev + 1);
          }
        } else {
          setTrackIndex(-1);
        }
      };
    }

    return () => {
      if (currentAudioRef) currentAudioRef.onended = null;
    };
  }, [audioRef, repeatType, setTrackIndex, trackIndex, trackList.length]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.volume = volume / 100;
    }
  }, [audioRef, volume]);

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setCurrentTime(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setCurrentTime, audioRef, progressBarRef]);

  const playAnimationRef = useRef<number | null>(null);
  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress(); // Ensure progress is updated immediately when paused
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  return (
    <BoxCol fillWidth>
      <audio
        ref={audioRef}
        key={currentTrack?.src}
        src={currentTrack?.src}
        onLoadedMetadata={onLoadedMetadata}
      />
      <Box
        className={controlsContainerCss}
        fillWidth
        justifyContent="space-between"
      >
        <Box gap={6}>
          <IconButton
            title="Toggle track list"
            onClick={() => setShowTrackList((prev) => !prev)}
            icon={faList}
            style={{ color: showTrackList ? "var(--color-theme-red)" : "" }}
          />
          <IconButton
            title="Toggle add track"
            onClick={() => setShowAddTrack((prev) => !prev)}
            icon={faAdd}
            style={{ color: showAddTrack ? "var(--color-theme-red)" : "" }}
          />
        </Box>
        <Box gap={6}>
          <IconButton
            title="Previous track"
            icon={faBackwardStep}
            onClick={prevTrack}
          />
          <IconButton
            title="Rewind"
            icon={faFastBackward}
            onClick={() => seek(-SEEK_SECONDS)}
          />
          <IconButton
            title={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? faPause : faPlay}
            onClick={togglePlay}
          />
          <IconButton
            title="Fast forward"
            icon={faFastForward}
            onClick={() => seek(SEEK_SECONDS)}
          />
          <IconButton
            title="Next track"
            icon={faForwardStep}
            onClick={nextTrack}
          />
        </Box>
        <Box gap={6}>
          <IconButton
            title={getRepeatTypeDisplay(repeatType)}
            onClick={toggleRepeatType}
            icon={
              repeatType === "none" || repeatType === "all" ? faRepeat : fa1
            }
            style={{
              color: repeatType !== "none" ? "var(--color-theme-red)" : "",
            }}
          />
          <IconButton
            title="Toggle volume control"
            onClick={() => setShowVolume((prev) => !prev)}
            icon={faVolumeHigh}
            style={{ color: showVolume ? "var(--color-theme-red)" : "" }}
          />
        </Box>
      </Box>
      <Volume show={showVolume} />
    </BoxCol>
  );
}
