import {
  faBackwardStep,
  faFastBackward,
  faFastForward,
  faForwardStep,
  faList,
  faPause,
  faPlay,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "../../../components/Box";
import { useAudioPlayerContext } from "../context/AudioPlayerContext";
import { controlsContainerCss } from "../styles";

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
    setDuration,
    showTrackList,
    setShowTrackList,
    currentTrack,
    isPlaying,
    setIsPlaying,
  } = useAudioPlayerContext();

  const [isRepeat, setIsRepeat] = useState(false);

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (trackIndex === trackList.length - 1 && isRepeat) {
          setTrackIndex(0);
        } else if (trackIndex < trackList.length) {
          setTrackIndex((prev) => prev + 1);
        } else {
          setTrackIndex(-1);
        }
      };
    }

    return () => {
      if (currentAudioRef) currentAudioRef.onended = null;
    };
  }, [audioRef, isRepeat, setTrackIndex, trackIndex, trackList.length]);

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

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  const playAnimationRef = useRef<number | null>(null);
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
    <>
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
        <Box>
          <button
            title="Toggle track list"
            onClick={() => setShowTrackList((prev) => !prev)}
            style={{ color: showTrackList ? "#ff6060" : "" }}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </Box>
        <Box gap={6}>
          <button
            title="Previous track"
            onClick={() => {
              if (trackIndex === 0 && isRepeat) {
                setTrackIndex(trackList.length - 1);
                return;
              }
              setTrackIndex((prev) => Math.max(prev - 1, 0));
            }}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>
          <button
            title="Rewind"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime -= SEEK_SECONDS;
              }
            }}
          >
            <FontAwesomeIcon icon={faFastBackward} />
          </button>
          <button
            title={isPlaying ? "Pause" : "Play"}
            onClick={() => setIsPlaying((prev) => !prev)}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button
            title="Fast forward"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime += SEEK_SECONDS;
              }
            }}
          >
            <FontAwesomeIcon icon={faFastForward} />
          </button>
          <button
            title="Next track"
            onClick={() => {
              if (trackIndex === trackList.length - 1 && isRepeat) {
                setTrackIndex(0);
                return;
              }
              setTrackIndex((prev) => Math.min(prev + 1, trackList.length - 1));
            }}
          >
            <FontAwesomeIcon icon={faForwardStep} />
          </button>
        </Box>
        <Box>
          <button
            title="Toggle repeat"
            onClick={() => setIsRepeat((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={faRepeat}
              style={{ color: isRepeat ? "#f34646" : "" }}
            />
          </button>
        </Box>
      </Box>
    </>
  );
}
