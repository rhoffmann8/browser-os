import { JSX } from "react";
import { DesktopWindow } from "../types";
import { AppId, Application } from "../types/application";
import { ExternalLink } from "./external-link/ExternalLink";
import { MemoryGame } from "./memory-game/MemoryGame";
import { PDF } from "./pdf/PDF";
import { TextEditor } from "./text-editor/TextEditor";

export const APPLICATION_MAP: {
  [key in AppId]: (props: {
    params: Extract<Application, { id: key }>["params"];
    window: DesktopWindow;
  }) => JSX.Element;
} = {
  "external-link": ExternalLink,
  "memory-game": MemoryGame,
  pdf: PDF,
  textEditor: TextEditor,
};

export function getApplicationFromId<K extends AppId>(key: K) {
  return APPLICATION_MAP[key];
}
