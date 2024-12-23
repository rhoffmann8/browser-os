import { RepeatType } from "./components/hooks/useAudioControls";
import { Track } from "./context/AudioPlayerContext";

export function getTrackTitle(track: Track) {
  return `${track.author ? `${track.author} - ` : ""}${track.title}`;
}

export function getRepeatTypeDisplay(repeatType: RepeatType) {
  return repeatType === "all"
    ? "Repeat all"
    : repeatType === "one"
    ? "Repeat one"
    : "No repeat";
}
