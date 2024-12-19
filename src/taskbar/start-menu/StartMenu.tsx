import { css } from "@emotion/css";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxCol } from "../../components/Box";
import {
  GITHUB_LINK_APPLICATION,
  LINKEDIN_LINK_APPLICATION,
  RESUME_PDF_APPLICATION,
  ZIndex,
} from "../../constants";
import { useDesktopStore } from "../../state/desktopState";
import { Avatar } from "./Avatar";
import { PowerButtons } from "./PowerButtons";

const widgets = [
  {
    position: { x: 100, y: 40 },
    application: RESUME_PDF_APPLICATION,
    title: "Resume",
    icon: faFilePdf,
  },
  {
    dimensions: { height: 0, width: 0 },
    position: { x: 0, y: 0 },
    application: GITHUB_LINK_APPLICATION,
    title: "Github",
    icon: faGithub,
  },
  {
    application: LINKEDIN_LINK_APPLICATION,
    dimensions: { height: 0, width: 0 },
    position: { x: 0, y: 0 },
    title: "LinkedIn",
    icon: faLinkedin,
  },
];

export function StartMenu({ onItemClick }: { onItemClick: () => void }) {
  const addWidget = useDesktopStore((state) => state.addWidget);

  return (
    <Box className={menuCss}>
      <BoxCol justifyContent="space-between" gap={4} padding="0 4px 4px 4px">
        <Avatar />
        <PowerButtons />
      </BoxCol>
      <BoxCol padding={"0 0 6rem 0"} style={{ borderLeft: "1px solid #333" }}>
        <ul>
          {widgets.map((widget) => (
            <li
              onClick={() => {
                addWidget(widget);
                onItemClick();
              }}
            >
              <Box alignItems="center" gap={12}>
                <FontAwesomeIcon icon={widget.icon} size="xl" />
                <span>{widget.title}</span>
              </Box>
            </li>
          ))}
        </ul>
      </BoxCol>
    </Box>
  );
}

const menuCss = css`
  position: absolute;
  left: 0;
  bottom: 2rem;

  border-radius: none;
  overflow: hidden;

  z-index: ${ZIndex.StartMenu};

  background: var(--color-theme-gradient);
  box-shadow: var(--box-shadow-primary);

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 1rem 4rem 1rem 1.6rem;
    cursor: pointer;

    &:hover {
      background: var(--color-theme-hover);
    }
  }
`;
