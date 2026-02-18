import { css } from "@emotion/css";
import {
  faGithub,
  faLinkedin,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "react-transition-group";
import { Box, BoxCol } from "../../components/Box";
import { ZIndex } from "../../constants/constants";
import { useAddWidget } from "../../state/widgetState";
import { WidgetSettings } from "../../types/widget";
import { Avatar } from "./Avatar";
import { PowerButtons } from "./PowerButtons";
import { ApplicationId } from "../../types/application";
import { useRef } from "react";

const widgets: (WidgetSettings & { icon: IconDefinition })[] = [
  {
    dimensions: { height: 0, width: 0 },
    position: { x: 0, y: 0 },
    applicationId: ApplicationId.ExternalLink,
    params: { url: "https://github.com/rhoffmann8" },
    title: "Github",
    icon: faGithub,
  },
  {
    applicationId: ApplicationId.ExternalLink,
    params: { url: "https://linkedin.com/in/rhoffmann8" },
    dimensions: { height: 0, width: 0 },
    position: { x: 0, y: 0 },
    title: "LinkedIn",
    icon: faLinkedin,
  },
];

const duration = 100;

const transitionStyles = {
  entering: { transform: "translateY(100%)", opacity: 0 },
  entered: { transform: "translateY(0)", opacity: 1 },
  exiting: { transform: "translateY(0)", opacity: 1 },
  exited: { transform: "translateY(100%)", opacity: 0 },
  unmounted: { transform: "translateY(100%)", opacity: 0 },
};

const defaultStyle = {
  transition: `all ${duration}ms ease-out`,
  transform: "translateY(100%)",
  opacity: 0,
};

interface Props {
  show: boolean;
  onItemClick: () => void;
}

export function StartMenu({ show, onItemClick }: Props) {
  const addWidget = useAddWidget();

  const nodeRef = useRef(null);

  return (
    <Transition nodeRef={nodeRef} in={show} timeout={duration}>
      {(state) => (
        <Box
          className={menuCss}
          style={{ ...defaultStyle, ...transitionStyles[state] }}
        >
          <BoxCol
            justifyContent="space-between"
            gap={4}
            padding="0 4px 4px 4px"
          >
            <Avatar />
            <PowerButtons />
          </BoxCol>
          <BoxCol
            padding={"0 0 6rem 0"}
            style={{ borderLeft: "1px solid #333" }}
          >
            <ul>
              {widgets.map((widget, index) => (
                <li
                  key={index}
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
      )}
    </Transition>
  );
}

const menuCss = css`
  position: absolute;
  left: 0;
  bottom: 2rem;

  border-radius: 0;
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
