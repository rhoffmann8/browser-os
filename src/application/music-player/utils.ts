import * as id3 from "id3js";
import { Track } from "./context/AudioPlayerContext";

export function getTrackTitle(track: Track) {
  return `${track.author ? `${track.author} - ` : ""}${track.title}`;
}

export function getTags(url: string) {
  return id3.fromUrl(url);
}
