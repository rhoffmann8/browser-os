import { css } from "@emotion/css";
import { useDesktopStore } from "../state/desktopState";
import {
  GITHUB_LINK_APPLICATION,
  LINKEDIN_LINK_APPLICATION,
  RESUME_PDF_APPLICATION,
} from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Box } from "../components/Box";
import { Widget } from "../types";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const menuCss = css`
  position: absolute;
  list-style: none;
  padding: 0;
  margin: 0;

  border-radius: none;
  overflow: hidden;

  background: var(--color-theme-gradient);
  left: 0;
  bottom: 2rem;

  box-shadow: var(--box-shadow-primary);

  li {
    padding: 1rem 3rem 1rem 2rem;
    cursor: pointer;

    &:hover {
      background: var(--color-theme-hover);
    }
  }
`;

export function StartMenu({ onItemClick }: { onItemClick: () => void }) {
  const addWindow = useDesktopStore((state) => state.addWidget);

  const [resumeWindow, githubWindow, linkedInWindow]: Omit<
    Widget,
    "id" | "stackIndex"
  >[] = [
    {
      dimensions: { height: 1000, width: 800 },
      position: { x: 200, y: 60 },
      application: RESUME_PDF_APPLICATION,
      title: "Resume",
    },
    {
      dimensions: { height: 0, width: 0 },
      position: { x: 0, y: 0 },
      application: GITHUB_LINK_APPLICATION,
      title: "Github",
    },
    {
      application: LINKEDIN_LINK_APPLICATION,
      dimensions: { height: 0, width: 0 },
      position: { x: 0, y: 0 },
      title: "LinkedIn",
    },
  ];

  return (
    <ul className={menuCss}>
      <li
        onClick={() => {
          addWindow(resumeWindow);
          onItemClick();
        }}
      >
        <Box alignItems="center" gap={12}>
          <FontAwesomeIcon icon={faFilePdf} />
          <span>Resume</span>
        </Box>
      </li>
      <li
        onClick={() => {
          addWindow(githubWindow);
          onItemClick();
        }}
      >
        <Box alignItems="center" gap={12}>
          <FontAwesomeIcon icon={faGithub} />
          <span>Github</span>
        </Box>
      </li>
      <li
        onClick={() => {
          addWindow(linkedInWindow);
          onItemClick();
        }}
      >
        <Box alignItems="center" gap={12}>
          <FontAwesomeIcon icon={faLinkedin} />
          <span>LinkedIn</span>
        </Box>
      </li>
    </ul>
  );
}
