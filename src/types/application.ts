import { Note } from "../application/text-editor/TextEditor";
import { Widget } from "../types";

export interface Application {
  id: string;
  params: object;
  singleInstance?: boolean;
}

export interface PDFViewerApplication extends Application {
  id: "pdf-viewer";
  params: { src: string };
}

export interface TextEditorApplication extends Application {
  id: "text-editor";
  params: { readonly?: boolean; activeFile?: Note };
}

export interface ExternalLinkApplication extends Application {
  id: "external-link";
  params: { url: string };
}

export interface MemoryGameApplication extends Application {
  id: "memory-game";
  params: object;
}

export interface DialogApplication extends Application {
  id: "dialog";
  params: { message: string };
}

export interface MusicPlayerApplication extends Application {
  id: "music-player";
  params: object;
}

export interface MarkdownViewerApplication extends Application {
  id: "markdown-viewer";
  params: { content: string };
}

export type AppId = (
  | DialogApplication
  | ExternalLinkApplication
  | MarkdownViewerApplication
  | MemoryGameApplication
  | MusicPlayerApplication
  | PDFViewerApplication
  | TextEditorApplication
)["id"];

export type ApplicationComponentProps<A extends Application> = {
  params: A["params"];
  widget: Widget<A>;
};
export type ApplicationComponent<A extends Application> = (
  props: ApplicationComponentProps<A>
) => JSX.Element | null;
