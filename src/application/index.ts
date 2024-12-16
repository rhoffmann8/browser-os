import { JSX } from "react";
import { Widget } from "../types";
import { AppId, Application } from "../types/application";
import { ExternalLink } from "./external-link/ExternalLink";
import { MemoryGame } from "./memory-game/MemoryGame";
import { PDF } from "./pdf/PDF";
import { TextEditor } from "./text-editor/TextEditor";
import { FileObjectType } from "../filesystem/types";
import { Dialog } from "./dialog/Dialog";
import { MusicPlayer } from "./music-player/MusicPlayer";

export const APPLICATION_MAP: {
  [key in AppId]: (props: {
    params: Extract<Application, { id: key }>["params"];
    widget: Widget;
  }) => JSX.Element;
} = {
  dialog: Dialog,
  "external-link": ExternalLink,
  "memory-game": MemoryGame,
  "music-player": MusicPlayer,
  pdf: PDF,
  textEditor: TextEditor,
};

export function getApplicationFromId<K extends AppId>(key: K) {
  return APPLICATION_MAP[key];
}

export class ApplicationRegistry {
  static registry: Map<FileObjectType, Application> = new Map();

  static register(fileType: FileObjectType, application: Application) {
    this.registry.set(fileType, application);
  }

  static getApplicationForFileType(fileType: FileObjectType) {
    return this.registry.get(fileType);
  }
}
