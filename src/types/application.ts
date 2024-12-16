import { DesktopWindow } from "../types";

export interface PDFApplication {
  id: "pdf";
  params: { src: string };
}

export interface TextEditorApplication {
  id: "textEditor";
  params: { content: string };
}

export interface ExternalLinkApplication {
  id: "external-link";
  params: { url: string };
}

export interface MemoryGameApplication {
  id: "memory-game";
  params: object;
}

export type Application =
  | ExternalLinkApplication
  | MemoryGameApplication
  | PDFApplication
  | TextEditorApplication;
export type AppId = Application["id"];

export type ApplicationComponent<K extends AppId> = (props: {
  params: Extract<Application, { id: K }>["params"];
  window: DesktopWindow;
}) => JSX.Element;
