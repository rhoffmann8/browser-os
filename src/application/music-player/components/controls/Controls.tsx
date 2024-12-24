import { css } from "@emotion/css";
import {
  fa1,
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
import { ID3Tag } from "id3js/lib/id3Tag";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, BoxCol } from "../../../../components/Box";
import { IconButton } from "../../../../components/IconButton";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";
import { controlsContainerCss } from "../../styles";
import { getRepeatTypeDisplay, parseUploadedFiles } from "../../utils";
import { useAudioControls } from "../hooks/useAudioControls";
import { AddTrackButton } from "./AddTrackButton";
import { Volume } from "./Volume";

const SEEK_SECONDS = 10;

export function Controls() {
  const {
    audioRef,
    trackList,
    setCurrentTrack,
    setCurrentTime,
    progressBarRef,
    duration,
    showTrackList,
    setShowTrackList,
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setTrackList,
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
        const trackIndex = trackList.findIndex((t) => t === currentTrack);
        if (trackIndex === trackList.length - 1 && repeatType === "all") {
          setCurrentTrack(trackList[0]);
        } else if (trackIndex < trackList.length) {
          if (repeatType === "one") {
            currentAudioRef.currentTime = 0;
            currentAudioRef.play();
          } else {
            nextTrack();
          }
        } else {
          setCurrentTrack(undefined);
        }
      };
    }

    return () => {
      if (currentAudioRef) currentAudioRef.onended = null;
    };
  }, [
    audioRef,
    currentTrack,
    nextTrack,
    repeatType,
    setCurrentTrack,
    trackList,
    trackList.length,
  ]);

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

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const clearFileInput = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  const onAddTracks = useCallback(
    (filesToAdd: { tags: ID3Tag | null; src: string; title: string }[]) => {
      const newTrackList = [
        ...trackList,
        ...filesToAdd.map(({ tags, src, title }) => ({
          src,
          author: tags?.artist ?? "",
          title: title ?? src,
        })),
      ];
      setTrackList(newTrackList);
      setCurrentTrack(newTrackList[trackList.length]);
      setIsPlaying(true);
      clearFileInput();
    },
    [setCurrentTrack, setIsPlaying, setTrackList, trackList]
  );

  const onUploadFile: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const filesToAdd = await parseUploadedFiles(
        e.currentTarget.files,
        trackList
      );
      clearFileInput();
      onAddTracks(filesToAdd);
    },
    [onAddTracks, trackList]
  );

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
          <AddTrackButton fileUploadRef={fileUploadRef} />
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
        <input
          ref={fileUploadRef}
          className={fileUploadCss}
          type="file"
          onChange={onUploadFile}
          multiple
        />
      </Box>
      <Volume show={showVolume} />
    </BoxCol>
  );
}

const fileUploadCss = css`
  position: absolute;
  visibility: hidden;
`;
