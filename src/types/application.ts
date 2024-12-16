import { Widget } from "../types";

export interface PDFApplication {
  id: "pdf";
  params: { src: string };
}

export interface TextEditorApplication {
  id: "text-editor";
  params: { content: string; readonly?: boolean };
}

export interface ExternalLinkApplication {
  id: "external-link";
  params: { url: string };
}

export interface MemoryGameApplication {
  id: "memory-game";
  params: object;
}

export interface DialogApplication {
  id: "dialog";
  params: { message: string };
}

export interface MusicPlayerApplication {
  id: "music-player";
  params: object;
}

export interface MarkdownViewerApplication {
  id: "markdown-viewer";
  params: { content: string };
}

export type Application =
  | DialogApplication
  | ExternalLinkApplication
  | MarkdownViewerApplication
  | MemoryGameApplication
  | MusicPlayerApplication
  | PDFApplication
  | TextEditorApplication;
export type AppId = Application["id"];

export type ApplicationComponent<K extends AppId> = (props: {
  params: Extract<Application, { id: K }>["params"];
  widget: Widget;
}) => JSX.Element | null;
