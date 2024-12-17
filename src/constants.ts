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
  PDFApplication,
  TextEditorApplication,
} from "./types/application";
import { createIcon } from "./utils";

export const DEFAULT_WINDOW_HEIGHT = 300;
export const DEFAULT_WINDOW_WIDTH = 400;

export const DEFAULT_TEXT_EDITOR: TextEditorApplication = {
  id: "text-editor",
  params: { content: "" },
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
    createIcon(
      "About",
      {
        id: "markdown-viewer",
        params: {
          content: aboutString,
        },
      },
      faInfoCircle,
      generateIconPos(),
      { dimensions: { height: 300, width: 500 }, position: { x: 400, y: 100 } }
    ),
    createIcon("Resume", RESUME_PDF_APPLICATION, faFilePdf, generateIconPos(), {
      dimensions: {
        height: window.innerHeight * 0.8,
      },
      position: { x: 100, y: 40 },
    }),
    createIcon(
      "Contact",
      { id: "external-link", params: { url: "mailto:contact@robhoffmann.me" } },
      faEnvelope,
      generateIconPos(),
      { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } }
    ),
    createIcon("Github", GITHUB_LINK_APPLICATION, faGithub, generateIconPos(), {
      dimensions: { height: 0, width: 0 },
      position: { x: 0, y: 0 },
    }),
    createIcon(
      "LinkedIn",
      LINKEDIN_LINK_APPLICATION,
      faLinkedin,
      generateIconPos(),
      { dimensions: { height: 0, width: 0 }, position: { x: 0, y: 0 } }
    ),
    createIcon(
      "Text editor",
      DEFAULT_TEXT_EDITOR,
      faPencil,
      generateIconPos(),
      {
        dimensions: { height: 300, width: 500 },
        position: { x: 100, y: 100 },
      }
    ),
    createIcon(
      "Memory",
      { id: "memory-game", params: {} },
      faChessBoard,
      generateIconPos(),
      { position: { x: 400, y: 100 }, resizable: false }
    ),
    createIcon(
      "Music",
      { id: "music-player", params: {} },
      faMusic,
      generateIconPos(),
      { position: { x: 400, y: 100 }, resizable: false }
    ),
  ];
}

export const DEFAULT_ICONS = createDefaultIcons();

export const TASKBAR_WIDGET_NETWORK = "taskbar-network";
export const TASKBAR_WIDGET_CLOCK = "taskbar-clock";

export const STORAGE_KEYS = {
  widgets: "desktop-widgets",
  background: "desktop-background",
  icons: "icons",
  taskbarActiveItems: "taskbar-active-items",
};
