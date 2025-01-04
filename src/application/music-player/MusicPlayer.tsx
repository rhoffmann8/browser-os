import { css } from "@emotion/css";
import * as id3 from "id3js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box, BoxCol } from "../../components/Box";
import { ApplicationComponent } from "../../types/application";
import { Controls } from "./components/controls/Controls";
import { ProgressBar } from "./components/controls/ProgressBar";
import { TrackDisplay } from "./components/TrackDisplay";
import { TrackList } from "./components/TrackList";

import { ID3Tag } from "id3js/lib/id3Tag";
import {
  useSetWidgetDimensions,
  useWidgetStore,
} from "../../state/widgetState";
import { AddTrack } from "./components/AddTrack";
import { AudioPlayerContext, Track } from "./context/AudioPlayerContext";

export const MusicPlayer: ApplicationComponent = ({ widget }) => {
  const { filePath } = widget;
  const [prevFilePath, setPrevFilePath] = useState<string | undefined>();
  const [trackList, setTrackList] = useState<Track[]>([]);

  const [currentTrack, setCurrentTrack] = useState<Track | undefined>();
  const [showTrackList, setShowTrackList] = useState(false);
  const [showAddTrack, setShowAddTrack] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(100);

  const [isPlaying, setIsPlaying] = useState(!!filePath);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const trackIndex = useMemo(
    () => trackList.findIndex((t) => t === currentTrack),
    [currentTrack, trackList]
  );

  const setTitle = useWidgetStore((state) => state.setWidgetTitle);
  const setWidgetDimensions = useSetWidgetDimensions();

  const loadFromFilePath = useCallback(async () => {
    if (!filePath) return;
    let tags: ID3Tag | null = null;
    try {
      tags = await id3.fromUrl(filePath);
    } catch {
      // toast.error("Error loading tags: " + getErrorMessage(e));
    }

    const trackFromFilePath: Track | undefined = filePath
      ? {
          src: filePath,
          title: tags?.title ?? filePath.split("/").at(-1)!,
          author: tags?.artist ?? "",
        }
      : undefined;

    if (trackFromFilePath) {
      setTrackList((prev) =>
        prev.find((t) => t.src === trackFromFilePath.src)
          ? prev
          : prev.concat(trackFromFilePath)
      );

      setTimeout(() => {
        const existingTrack = trackList.find(
          (t) => t.src === trackFromFilePath.src
        );
        setCurrentTrack(existingTrack ?? trackFromFilePath);
        setIsPlaying(true);
      });
    }
  }, [filePath, trackList]);

  useEffect(() => {
    if (prevFilePath !== filePath) {
      loadFromFilePath();
      setPrevFilePath(filePath);
    }
  }, [filePath, loadFromFilePath, prevFilePath]);

  useEffect(() => {
    setTitle(widget.id, trackList[trackIndex]?.title ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackList, trackIndex, widget.id]);

  useEffect(() => {
    setWidgetDimensions(widget.id, { width: 340 });
  }, [setWidgetDimensions, widget.id]);

  useEffect(() => {
    if (!currentTrack) {
      setIsPlaying(false);
    }
  }, [currentTrack]);

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <AudioPlayerContext.Provider
        value={{
          audioRef,
          progressBarRef,
          trackIndex,
          currentTrack,
          trackList,
          setTrackList,
          setCurrentTrack,
          showTrackList,
          setShowTrackList,
          currentTime,
          setCurrentTime,
          duration,
          setDuration,
          isPlaying,
          setIsPlaying,
          volume,
          setVolume,
          showAddTrackUrl: showAddTrack,
          setShowAddTrackUrl: setShowAddTrack,
        }}
      >
        <Inner />
      </AudioPlayerContext.Provider>
    </Box>
  );
};

const containerCss = css`
  background: #111;
  padding: 8px;
  color: white;
  width: 340px;
`;

function Inner() {
  return (
    <BoxCol className={containerCss} alignItems="center">
      <BoxCol fillWidth gap={8}>
        <TrackDisplay />
        <ProgressBar />
        <Controls />
      </BoxCol>
      <AddTrack />
      <TrackList />
    </BoxCol>
  );
}
