import {
  faFile,
  faFileAlt,
  faFileAudio,
  faFilePdf,
  faFileVideo,
} from "@fortawesome/free-solid-svg-icons";
import fs, { Dirent } from "@zenfs/core";
import { FSWatcher } from "@zenfs/core/emulation/watchers.js";
import { ApplicationId } from "../../types/application";

export enum FileType {
  UNKNOWN,

  TEXT,
  PDF,
  LINK,

  AUDIO,
  VIDEO,

  APPLICATION,
}

interface FsAsync {
  stat: (path: string) => Promise<fs.Stats>;
  readFile: (path: string) => Promise<Buffer>;
  readdir: (path: string) => Promise<Dirent[]>;
  realpath: (path: string) => Promise<string>;
  mkdir: (path: string) => Promise<void>;
  writeFile: (path: string, data: Buffer | string) => Promise<void>;
  deleteFile: (path: string) => void;
  watch: (
    path: string | undefined,
    listener: (event: string, filename: string) => void
  ) => FSWatcher;
}

export const fsAsync: FsAsync = {
  stat(path) {
    return fs.promises.stat(path);
  },

  readFile(path) {
    return fs.promises.readFile(path);
  },

  readdir(path) {
    return fs.promises.readdir(path, { withFileTypes: true });
  },

  realpath(path) {
    return fs.promises.realpath(path);
  },

  mkdir(path) {
    return fs.promises.mkdir(path);
  },

  writeFile(path, content) {
    return fs.promises.writeFile(path, content);
  },

  async deleteFile(path) {
    const isFolder = (await fsAsync.stat(path)).isDirectory();
    return isFolder ? fs.promises.rmdir(path) : fs.promises.rm(path);
  },

  watch(path = "/", listener) {
    return fs.watch(path, listener);
  },
};

function getExtension(path: string | undefined) {
  return !path ? undefined : path.split(".").pop();
}

export function getFileType(path: string | undefined): FileType {
  const extension = getExtension(path);
  if (!extension) return FileType.UNKNOWN;

  switch (extension) {
    case "txt":
      return FileType.TEXT;
    case "pdf":
      return FileType.PDF;
    case "link":
      return FileType.LINK;
    case "mp3":
      return FileType.AUDIO;
    case "exe":
      return FileType.APPLICATION;
    default:
      return FileType.UNKNOWN;
  }
}

export function getApplicationIdForFileType(fileType: FileType): ApplicationId {
  switch (fileType) {
    case FileType.PDF:
      return ApplicationId.PDFViewer;
    case FileType.TEXT:
      return ApplicationId.TextEditor;
    case FileType.AUDIO:
      return ApplicationId.MusicPlayer;
    case FileType.VIDEO:
      return ApplicationId.VideoPlayer;
    default:
      return ApplicationId.Unknown;
  }
}

export function getIconForFileType(fileType: FileType) {
  switch (fileType) {
    case FileType.PDF:
      return faFilePdf;
    case FileType.TEXT:
      return faFileAlt;
    case FileType.AUDIO:
      return faFileAudio;
    case FileType.VIDEO:
      return faFileVideo;
    default:
      return faFile;
  }
}
