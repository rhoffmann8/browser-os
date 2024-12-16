import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faChessBoard,
  faEnvelope,
  faFilePdf,
  faFileText,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./types";
import {
  ExternalLinkApplication,
  PDFApplication,
  TextEditorApplication,
} from "./types/application";
import { createIcon } from "./utils";

export const DEFAULT_WINDOW_HEIGHT = 300;
export const DEFAULT_WINDOW_WIDTH = 400;

export const DEFAULT_TEXT_EDITOR: TextEditorApplication = {
  id: "textEditor",
  params: { content: "Your text goes here" },
};

export const RESUME_PDF_APPLICATION: PDFApplication = {
  id: "pdf",
  params: { src: "/Hoffmann_Resume.pdf" },
};

export const GITHUB_LINK_APPLICATION: ExternalLinkApplication = {
  id: "external-link",
  params: { url: "https://github.com/rhoffmann8" },
};

export const LINKEDIN_LINK_APPLICATION: ExternalLinkApplication = {
  id: "external-link",
  params: { url: "https://linkedin.com/in/rhoffmann8" },
};

let yPos = 10;
function getYPos() {
  yPos += 90;
  return yPos - 90;
}

export const DEFAULT_ICONS: Icon[] = [
  createIcon(
    "Resume",
    RESUME_PDF_APPLICATION,
    faFilePdf,
    { x: 10, y: getYPos() },
    { dimensions: { height: 1000, width: 800 }, position: { x: 200, y: 60 } }
  ),
  createIcon(
    "About",
    {
      id: "textEditor",
      params: { content: "My name is Rob and I code things." },
    },
    faFileText,
    { x: 10, y: getYPos() },
    { dimensions: { height: 300, width: 500 }, position: { x: 400, y: 100 } }
  ),
  createIcon(
    "Contact",
    { id: "external-link", params: { url: "mailto:contact@robhoffmann.me" } },
    faEnvelope,
    { x: 10, y: getYPos() },
    { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } }
  ),
  createIcon(
    "Github",
    GITHUB_LINK_APPLICATION,
    faGithub,
    { x: 10, y: getYPos() },
    { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } }
  ),
  createIcon(
    "LinkedIn",
    LINKEDIN_LINK_APPLICATION,
    faLinkedin,
    { x: 10, y: getYPos() },
    { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } }
  ),
  createIcon(
    "Memory game",
    { id: "memory-game", params: {} },
    faChessBoard,
    { x: 10, y: getYPos() },
    { dimensions: { height: 600, width: 600 }, position: { x: 400, y: 100 } }
  ),
  createIcon(
    "Music",
    { id: "music-player", params: {} },
    faMusic,
    { x: 10, y: getYPos() + 10 },
    { position: { x: 400, y: 100 }, resizable: false }
  ),
];

export const TASKBAR_WIDGET_NETWORK = "taskbar-network";
export const TASKBAR_WIDGET_CLOCK = "taskbar-clock";

export const STORAGE_KEYS = {
  widgets: "desktop-widgets",
  background: "desktop-background",
  icons: "icons",
  taskbarActiveItems: "taskbar-active-items",
};
