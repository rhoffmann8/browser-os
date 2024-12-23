import { AppId, Application, ApplicationComponent } from "../types/application";
import { ExternalLink } from "./external-link/ExternalLink";
import { MemoryGame } from "./memory-game/MemoryGame";
import { PDFViewer } from "./pdf-viewer/PDFViewer";
import { TextEditor } from "./text-editor/TextEditor";
// import { FileObjectType } from "../filesystem/types";
import { Dialog } from "./dialog/Dialog";
import { MarkdownViewer } from "./markdown-viewer/MarkdownViewer";
import { MusicPlayer } from "./music-player/MusicPlayer";
import { VideoPlayer } from "./video-player/VideoPlayer";

export const APPLICATION_MAP: {
  [K in AppId]: {
    title: string;
    component: ApplicationComponent<Extract<Application, { id: K }>>;
  };
} = {
  dialog: { title: "Dialog", component: Dialog },
  "external-link": { title: "", component: ExternalLink },
  "markdown-viewer": { title: "Markdown Viewer", component: MarkdownViewer },
  "memory-game": { title: "Memory", component: MemoryGame },
  "music-player": { title: "Music", component: MusicPlayer },
  "pdf-viewer": { title: "PDF Viewer", component: PDFViewer },
  "text-editor": { title: "Notes", component: TextEditor },
  "video-player": { title: "YouTube", component: VideoPlayer },
};

export function getApplicationComponentFromId<K extends AppId>(
  key: K
): ApplicationComponent<Extract<Application, { id: K }>> {
  return APPLICATION_MAP[key].component;
}

// export class ApplicationRegistry {
//   static registry: Map<FileObjectType, Application> = new Map();

//   static register(fileType: FileObjectType, application: Application) {
//     this.registry.set(fileType, application);
//   }

//   static getApplicationForFileType(fileType: FileObjectType) {
//     return this.registry.get(fileType);
//   }
// }
