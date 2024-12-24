import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faChessBoard,
  faEnvelope,
  faFilePdf,
  faFilm,
  faInfoCircle,
  faMusic,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { DesktopIcon } from "../types";
import { Application } from "../types/application";
import { createIcon } from "../utils/icon";
import {
  aboutString,
  DEFAULT_TEXT_EDITOR,
  GITHUB_LINK_APPLICATION,
  LINKEDIN_LINK_APPLICATION,
  RESUME_PDF_APPLICATION,
} from "./applications";

export const DESKTOP_ICON_HORIZONTAL_DELTA = 80;
export const DESKTOP_ICON_VERTICAL_DELTA = 80;

// TODO: Rethink icon positioning logic
export let xPos = 0;
export let yPos = 0;
export function createDefaultIcons(): DesktopIcon<Application>[] {
  xPos = 0;
  yPos = 0;
  return [
    createIcon({
      icon: {
        title: "About",
        description: "about me",
        application: {
          id: "markdown-viewer",
          params: { content: aboutString },
          singleInstance: true,
        },
        icon: faInfoCircle,
        position: generateIconPos(),
      },
      widget: {
        dimensions: { height: 304, width: 550 },
        position: { x: 400, y: 100 },
        title: "About",
      },
    }),
    createIcon({
      icon: {
        title: "Resume",
        description: "stuff I've done",
        application: RESUME_PDF_APPLICATION,
        icon: faFilePdf,
        position: generateIconPos(),
      },
      widget: {
        position: { x: 100, y: 40 },
        title: "Resume",
      },
    }),
    createIcon({
      icon: {
        title: "Contact",
        description: "email me",
        application: {
          id: "external-link",
          params: { url: "mailto:contact@robhoffmann.me" },
        },
        icon: faEnvelope,
        position: generateIconPos(),
      },
      widget: { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } },
    }),
    createIcon({
      icon: {
        title: "Github",
        description: "code",
        application: GITHUB_LINK_APPLICATION,
        icon: faGithub,
        position: generateIconPos(),
      },
      widget: { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } },
    }),
    createIcon({
      icon: {
        title: "LinkedIn",
        description: "jerbs",
        application: LINKEDIN_LINK_APPLICATION,
        icon: faLinkedin,
        position: generateIconPos(),
      },
      widget: { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } },
    }),
    createIcon({
      icon: {
        title: "Notes",
        description: "write some text",
        application: DEFAULT_TEXT_EDITOR,
        icon: faPencil,
        position: generateIconPos(),
      },
      widget: {
        dimensions: { height: 300, width: 500 },
        position: { x: 100, y: 100 },
      },
    }),
    createIcon({
      icon: {
        title: "Memory",
        description: "match the tiles",
        application: { id: "memory-game", params: {}, singleInstance: true },
        icon: faChessBoard,
        position: generateIconPos(),
      },
      widget: {
        dimensions: { width: 400 },
        position: { x: 400, y: 100 },
        resizable: false,
      },
    }),
    createIcon({
      icon: {
        title: "Music",
        description: "beats to recruit to",
        application: { id: "music-player", params: {} },
        icon: faMusic,
        position: generateIconPos(),
      },
      widget: {
        dimensions: { width: 340 },
        position: { x: 400, y: 100 },
        resizable: false,
      },
    }),
    createIcon({
      icon: {
        title: "a thing I made",
        description: "5 minutes of fame in 2011",
        application: {
          id: "video-player",
          params: {
            url: "https://www.youtube.com/watch?v=Zu8BcbzhPNE",
            start: 6,
          },
        },
        icon: faFilm,
        position: generateIconPos(),
      },
      widget: {
        dimensions: { width: 640, height: 480 },
        position: { x: 400, y: 100 },
        resizable: true,
      },
    }),
    // createIcon({
    //   icon: {
    //     title: "Stonks",
    //     application: {
    //       id: "stonks",
    //       params: { symbol: "GME" },
    //     },
    //     icon: faChartLine,
    //     position: generateIconPos(),
    //   },
    //   widget: {
    //     position: { x: 400, y: 100 },
    //   },
    // }),
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

export const DEFAULT_ICONS = createDefaultIcons();
