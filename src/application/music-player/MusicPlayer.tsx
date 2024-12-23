import { css } from "@emotion/css";
import { useEffect, useMemo, useRef, useState } from "react";

import { Box, BoxCol } from "../../components/Box";
import {
  ApplicationComponent,
  MusicPlayerApplication,
} from "../../types/application";
import { Controls } from "./components/controls/Controls";
import { ProgressBar } from "./components/controls/ProgressBar";
import { TrackDisplay } from "./components/TrackDisplay";
import { TrackList } from "./components/TrackList";

import track5 from "/music/majestic-sky-healing-meditative-cello-and-piano-230090.mp3";
import track1 from "/music/meditation-ambience-262905.mp3";
import track2 from "/music/meditation-for-relax-new-age-ambient-meditative-241462.mp3";
import track3 from "/music/nirvikalpa-new-age-ambient-meditative-227882.mp3";
import track4 from "/music/weightlessness-213970.mp3";

import { AudioPlayerContext, Track } from "./context/AudioPlayerContext";
import { AddTrack } from "./components/AddTrack";

const tracks: Track[] = [
  {
    title: "Meditation Ambience",
    src: track1,
    author: "Josef Surikov",
  },
  {
    title: "Meditation For Relax",
    src: track2,
    author: "Ashot Danielyan",
  },
  {
    title: "Nirvikalpa",
    src: track3,
    author: "Ashot Danielyan",
  },
  {
    title: "Weightlessness",
    src: track4,
    author: "Sergei Chetvertnykh",
  },
  {
    title: "Majestic Sky",
    src: track5,
    author: "Noru",
  },
];

export const MusicPlayer: ApplicationComponent<MusicPlayerApplication> = ({
  widget,
}) => {
  const [trackList, setTrackList] = useState<Track[]>(tracks);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [showTrackList, setShowTrackList] = useState(false);
  const [showAddTrack, setShowAddTrack] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(100);

  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    widget.setTitle(trackList[trackIndex]?.title ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackList, trackIndex, widget.setTitle]);

  const currentTrack = useMemo(
    () => trackList[trackIndex],
    [trackIndex, trackList]
  );

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
          currentTrack,
          trackList,
          setTrackList,
          trackIndex,
          setTrackIndex,
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
          showAddTrack,
          setShowAddTrack,
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

  overflow: hidden;
`;

function Inner() {
  return (
    <BoxCol className={containerCss} alignItems="center">
      <BoxCol fillWidth gap={8}>
        <TrackDisplay />
        <ProgressBar />
        <Controls />
      </BoxCol>
      <TrackList />
      <AddTrack />
    </BoxCol>
  );
}
