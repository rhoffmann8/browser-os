import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faChessBoard,
  faComputer,
  faEnvelope,
  faFilm,
  faInfoCircle,
  faMusic,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { DesktopIcon } from "../types/widget";
import { createIcon } from "../utils/icon";
import { aboutString } from "./applications";
import { ApplicationId } from "../types/application";

export const DESKTOP_ICON_HORIZONTAL_DELTA = 80;
export const DESKTOP_ICON_VERTICAL_DELTA = 80;

// TODO: Rethink icon positioning logic
export let xPos = 0;
export let yPos = 0;

export function createDefaultIcons(): DesktopIcon[] {
  let localX = 10;
  let localY = 10;
  function nextPos() {
    const out = { x: localX, y: localY };
    localY += DESKTOP_ICON_VERTICAL_DELTA;
    if (localY > window.innerHeight - 100) {
      localY = 10;
      localX += 80;
    }
    return out;
  }
  return [
    createIcon({
      icon: {
        title: "My PC",
        icon: faComputer,
        position: nextPos(),
      },
      widget: {
        applicationId: ApplicationId.Explorer,
        position: { x: 200, y: 100 },
        dimensions: { height: 300, width: 500 },
        filePath: "/",
      },
    }),
    createIcon({
      icon: {
        title: "About",
        description: "about me",
        icon: faInfoCircle,
        position: nextPos(),
      },
      widget: {
        dimensions: { height: 304, width: 550 },
        position: { x: 400, y: 100 },
        title: "About",
        applicationId: ApplicationId.MarkdownViewer,
        params: { content: aboutString },
      },
    }),
    createIcon({
      icon: {
        title: "Contact",
        description: "email me",
        icon: faEnvelope,
        position: nextPos(),
      },
      widget: {
        dimensions: { height: 0, width: 0 },
        position: { x: 0, y: 0 },
        applicationId: ApplicationId.ExternalLink,
        params: { url: "mailto:contact@robhoffmann.me" },
      },
    }),
    createIcon({
      icon: {
        title: "Github",
        description: "code",
        icon: faGithub,
        position: nextPos(),
      },
      widget: {
        dimensions: { height: 0, width: 0 },
        position: { x: 0, y: 0 },
        applicationId: ApplicationId.ExternalLink,
        params: { url: "https://github.com/rhoffmann8" },
      },
    }),
    createIcon({
      icon: {
        title: "LinkedIn",
        description: "jerbs",
        icon: faLinkedin,
        position: nextPos(),
      },
      widget: {
        dimensions: { height: 0, width: 0 },
        position: { x: 0, y: 0 },
        applicationId: ApplicationId.ExternalLink,
        params: { url: "https://linkedin.com/in/rhoffmann8" },
      },
    }),
    createIcon({
      icon: {
        title: "Notes",
        description: "write some text",
        icon: faPencil,
        position: nextPos(),
      },
      widget: {
        dimensions: { height: 300, width: 500 },
        position: { x: 100, y: 100 },
        applicationId: ApplicationId.TextEditor,
      },
    }),
    createIcon({
      icon: {
        title: "Memory",
        description: "match the tiles",
        icon: faChessBoard,
        position: nextPos(),
      },
      widget: {
        dimensions: { width: 400 },
        position: { x: 400, y: 100 },
        isResizable: false,
        applicationId: ApplicationId.MemoryGame,
        isSingleInstance: true,
      },
    }),
    createIcon({
      icon: {
        title: "Music",
        description: "beats to recruit to",
        icon: faMusic,
        position: nextPos(),
      },
      widget: {
        dimensions: { width: 340 },
        position: { x: 400, y: 100 },
        isResizable: false,
        applicationId: ApplicationId.MusicPlayer,
        isSingleInstance: true,
      },
    }),
    createIcon({
      icon: {
        title: "A thing I made",
        description: "5 minutes of fame in 2011",
        icon: faFilm,
        position: nextPos(),
      },
      widget: {
        dimensions: { width: 640, height: 480 },
        position: { x: 400, y: 100 },
        isResizable: true,
        applicationId: ApplicationId.VideoPlayer,
        params: {
          url: "https://www.youtube.com/watch?v=Zu8BcbzhPNE",
          start: 6,
        },
      },
    }),
  ];
}

export function generateIconPos() {
  if (xPos === 0 && yPos === 0) {
    xPos += 10;
    yPos += 10;
    return { x: xPos, y: yPos };
  }

  yPos += DESKTOP_ICON_VERTICAL_DELTA;
  if (yPos > window.innerHeight - 100) {
    yPos = 10;
    xPos += 80;
  }
  return { x: xPos, y: yPos };
}

// export const DEFAULT_ICONS = createDefaultIcons();
