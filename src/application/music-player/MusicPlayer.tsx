import { useMemo, useRef, useState } from "react";
import { ApplicationComponent } from "../../types/application";

import { css } from "@emotion/css";
import { Box } from "../../components/Box";
import { Controls } from "./components/Controls";
import { ProgressBar } from "./components/ProgressBar";
import { TrackDisplay } from "./components/TrackDisplay";
import { TrackList } from "./components/TrackList";

import track1 from "../../../public/music/meditation-ambience-262905.mp3";
import track2 from "../../../public/music/meditation-for-relax-new-age-ambient-meditative-241462.mp3";
import track3 from "../../../public/music/nirvikalpa-new-age-ambient-meditative-227882.mp3";

import { AudioPlayerContext, Track } from "./context/AudioPlayerContext";

const tracks: Track[] = [
  {
    title: "Meditation Ambience",
    src: track1,
    author: "leberchmus",
  },
  {
    title: "Meditation For Relax (New Age, Ambient, Meditative)",
    src: track2,
    author: "Ashot-Danielyan",
  },
  {
    title: "Nirvikalpa (New Age, Ambient, Meditative)",
    src: track3,
    author: "Ashot-Danielyan",
  },
];

export const MusicPlayer: ApplicationComponent<"music-player"> = () => {
  const [trackList, setTrackList] = useState<Track[]>(tracks);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [showTrackList, setShowTrackList] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);

  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const currentTrack = useMemo(
    () => trackList[trackIndex],
    [trackIndex, trackList]
  );

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
  width: 300px;

  button {
    height: 2rem;
    width: 2rem;
    border: none;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      box-shadow: 0px 0px 2px 1px #444 inset;
    }
  }
`;

function Inner() {
  return (
    <Box
      className={containerCss}
      flexDirection="column"
      alignItems="center"
      gap={8}
    >
      <TrackDisplay />
      <ProgressBar />
      <Controls />
      <TrackList />
    </Box>
  );
}
