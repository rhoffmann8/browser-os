import { Note } from "../application/text-editor/TextEditor";
import { Widget } from "../types";

export interface BaseApplication {
  id: string;
  params: object;
  singleInstance?: boolean;
}

export type Application =
  | DialogApplication
  | ExternalLinkApplication
  | MarkdownViewerApplication
  | MemoryGameApplication
  | MusicPlayerApplication
  | PDFViewerApplication
  | TextEditorApplication
  | VideoPlayerApplication;

export interface PDFViewerApplication extends BaseApplication {
  id: "pdf-viewer";
  params: { src: string };
}

export interface TextEditorApplication extends BaseApplication {
  id: "text-editor";
  params: { readonly?: boolean; activeFile?: Note };
}

export interface ExternalLinkApplication extends BaseApplication {
  id: "external-link";
  params: { url: string };
}

export interface MemoryGameApplication extends BaseApplication {
  id: "memory-game";
  params: object;
}

export interface DialogApplication extends BaseApplication {
  id: "dialog";
  params: { message: string };
}

export interface MusicPlayerApplication extends BaseApplication {
  id: "music-player";
  params: object;
}

export interface MarkdownViewerApplication extends BaseApplication {
  id: "markdown-viewer";
  params: { content: string };
}

export interface VideoPlayerApplication extends BaseApplication {
  id: "video-player";
  params: { url: string };
}

export type AppId = Application["id"];

export type ApplicationComponentProps<A extends Application> = {
  params: A["params"];
  widget: Widget<A>;
};
export type ApplicationComponent<A extends Application> = (
  props: ApplicationComponentProps<A>
) => JSX.Element | null;
