import { Dialog } from "../application/dialog/Dialog";
import { ExternalLink } from "../application/external-link/ExternalLink";
import { MarkdownViewer } from "../application/markdown-viewer/MarkdownViewer";
import { MemoryGame } from "../application/memory-game/MemoryGame";
import { MusicPlayer } from "../application/music-player/MusicPlayer";
import { PDFViewer } from "../application/pdf-viewer/PDFViewer";
import { TextEditor } from "../application/text-editor/TextEditor";
import { VideoPlayer } from "../application/video-player/VideoPlayer";
import { Explorer } from "../system/components/explorer/Explorer";
import { Widget } from "./widget";

export type ApplicationComponentProps = {
  widget: Widget;
};
export type ApplicationComponent = (
  props: ApplicationComponentProps
) => JSX.Element | null;

export enum ApplicationId {
  Dialog = "dialog",
  ExternalLink = "external-link",
  MarkdownViewer = "markdown-viewer",
  MemoryGame = "memory-game",
  MusicPlayer = "music-player",
  PDFViewer = "pdf-viewer",
  TextEditor = "text-editor",
  VideoPlayer = "video-player",
  Explorer = "explorer",

  Unknown = "",
}

export interface Application {
  id: ApplicationId;
  title: string;
  component: ApplicationComponent;
}

export const DialogApplication: Application = {
  id: ApplicationId.Dialog,
  title: "Dialog",
  component: Dialog,
};

export const ExternalLinkApplication: Application = {
  id: ApplicationId.ExternalLink,
  title: "",
  component: ExternalLink,
};

export const MarkdownViewerApplication: Application = {
  id: ApplicationId.MarkdownViewer,
  title: "Markdown Viewer",
  component: MarkdownViewer,
};

export const MemoryGameApplication: Application = {
  id: ApplicationId.MemoryGame,
  title: "Memory",
  component: MemoryGame,
};

export const MusicPlayerApplication: Application = {
  id: ApplicationId.MusicPlayer,
  title: "Music",
  component: MusicPlayer,
};

export const PDFViewerApplication: Application = {
  id: ApplicationId.PDFViewer,
  title: "PDF Viewer",
  component: PDFViewer,
};

export const TextEditorApplication: Application = {
  id: ApplicationId.TextEditor,
  title: "Notes",
  component: TextEditor,
};

export const VideoPlayerApplication: Application = {
  id: ApplicationId.VideoPlayer,
  title: "YouTube",
  component: VideoPlayer,
};

export const ExplorerApplication: Application = {
  id: ApplicationId.Explorer,
  title: "Explorer",
  component: Explorer,
};

const APPLICATION_MAP: { [key in ApplicationId]: Application } = {
  [ApplicationId.Dialog]: DialogApplication,
  [ApplicationId.ExternalLink]: ExternalLinkApplication,
  [ApplicationId.MarkdownViewer]: MarkdownViewerApplication,
  [ApplicationId.MemoryGame]: MemoryGameApplication,
  [ApplicationId.MusicPlayer]: MusicPlayerApplication,
  [ApplicationId.PDFViewer]: PDFViewerApplication,
  [ApplicationId.TextEditor]: TextEditorApplication,
  [ApplicationId.VideoPlayer]: VideoPlayerApplication,
  [ApplicationId.Explorer]: ExplorerApplication,
  [ApplicationId.Unknown]: {
    component: () => null,
    id: ApplicationId.Unknown,
    title: "",
  },
};

export function getApplicationFromId(id: ApplicationId): Application {
  return APPLICATION_MAP[id];
}
