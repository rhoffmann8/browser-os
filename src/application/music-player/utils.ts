import { Track } from "./context/AudioPlayerContext";

export function getTrackTitle(track: Track) {
  return `${track.author ? `${track.author} - ` : ""}${track.title}`;
}
