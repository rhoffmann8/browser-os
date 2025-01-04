import { ID3Tag } from "id3js/lib/id3Tag";
import { RepeatType } from "./components/hooks/useAudioControls";
import { Track } from "./context/AudioPlayerContext";
import * as id3 from "id3js";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/error";

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

export async function parseUploadedFiles(
  files: FileList | null,
  trackList: Track[]
) {
  if (!files || !files.length) return [];
  const filesToAdd: { tags: ID3Tag | null; src: string; title: string }[] = [];
  const validFiles = [...files].filter((file) => file.type.startsWith("audio"));
  await Promise.all(
    [...validFiles].map(async (file) => {
      let tags: ID3Tag | null = null;
      try {
        tags = await id3.fromFile(file);
      } catch (e) {
        toast.error(
          `Error reading tags for ${file.name}: ${getErrorMessage(e)}`
        );
      }
      const src = URL.createObjectURL(file);
      const alreadyUploaded = trackList.find((t) => t.src === src);
      if (!alreadyUploaded) {
        filesToAdd.push({ tags, src, title: tags?.title ?? file.name });
      }
    })
  );

  return filesToAdd;
}
