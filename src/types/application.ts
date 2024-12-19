import { APPLICATION_MAP } from "../application";
import { Note } from "../application/text-editor/TextEditor";
import { Widget } from "../types";

export interface PDFViewerApplication {
  id: "pdf-viewer";
  params: { src: string };
}

export interface TextEditorApplication {
  id: "text-editor";
  params: { readonly?: boolean; activeFile?: Note };
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
  | PDFViewerApplication
  | TextEditorApplication;
export type AppId = keyof typeof APPLICATION_MAP;

export type ApplicationComponentProps<K extends AppId> = {
  params: Extract<Application, { id: K }>["params"];
  widget: Widget;
};
export type ApplicationComponent<K extends AppId> = (
  props: ApplicationComponentProps<K>
) => JSX.Element | null;
