import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faChessBoard,
  faEnvelope,
  faFilePdf,
  faInfoCircle,
  faMusic,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { DesktopIcon } from "./types";
import {
  ExternalLinkApplication,
  PDFViewerApplication,
  TextEditorApplication,
} from "./types/application";
import { createIcon } from "./utils/icon";

export const DEFAULT_WINDOW_HEIGHT = 300;
export const DEFAULT_WINDOW_WIDTH = 400;

export const DEFAULT_TEXT_EDITOR: TextEditorApplication = {
  id: "text-editor",
  params: {},
};

export const RESUME_PDF_APPLICATION: PDFViewerApplication = {
  id: "pdf-viewer",
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

// TODO: Rethink icon positioning logic
let xPos = 0;
let yPos = 0;
function generateIconPos() {
  if (xPos === 0 && yPos === 0) {
    xPos += 10;
    yPos += 10;
    return { x: xPos, y: yPos };
  }

  yPos += 84;
  if (yPos > window.innerHeight - 100) {
    yPos = 10;
    xPos += 80;
  }
  return { x: xPos, y: yPos };
}

const aboutString = `
  # About
  
  My name is Rob and I code things.

  ## Questions?
  
  Click the Contact icon to send me an email.
`;

export function createDefaultIcons(): DesktopIcon[] {
  xPos = 0;
  yPos = 0;
  return [
    createIcon({
      icon: {
        title: "About",
        description: "about me",
        application: {
          id: "markdown-viewer",
          params: {
            content: aboutString,
          },
        },
        icon: faInfoCircle,
        position: generateIconPos(),
      },
      widget: {
        dimensions: { height: 300, width: 500 },
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
        application: { id: "memory-game", params: {} },
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
        dimensions: { width: 300 },
        position: { x: 400, y: 100 },
        resizable: false,
      },
    }),
  ];
}

export const DEFAULT_ICONS = createDefaultIcons();

export const TASKBAR_WIDGET_NETWORK = "taskbar-network";
export const TASKBAR_WIDGET_CLOCK = "taskbar-clock";

export enum StorageKeys {
  WIDGETS = "desktop-widgets",
  BACKGROUND = "desktop-background",
  ICONS = "icons",
  TASKBAR_ACTIVE_ITEMS = "taskbar-active-items",
  NOTES = "notes",
}

export enum ZIndex {
  StartMenu = 9998,
  Taskbar = 9999,
  ContextMenu = 10000,
  PowerOverlay = 10001,
  Toast = 10002,
}
