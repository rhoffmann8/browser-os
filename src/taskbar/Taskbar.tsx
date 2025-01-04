import { css } from "@emotion/css";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import { useOutsideClick } from "rooks";
import { Box } from "../components/Box";
import { ZIndex } from "../constants/constants";
import { useTaskbarContextMenu } from "../menu/hooks/useTaskbarContextMenu";
import { useContextMenuStore } from "../state/contextMenuState";
import { getButtonBackgroundGradientStyles } from "../utils/style";
import { OpenApplications } from "./OpenApplications";
import { StartMenu } from "./start-menu/StartMenu";
import { TaskbarWidgets } from "./widgets/TaskbarWidgets";

const taskbarCss = css`
  background: var(--color-theme-gradient);
  height: 2rem;

  padding-right: 0.4rem;

  display: flex;
  justify-content: space-between;

  position: relative;

  overflow: visible;
  z-index: ${ZIndex.Taskbar};
`;

const startButtonCss = css`
  background: ${getButtonBackgroundGradientStyles("#666").normal};
  border: none;
  border-top-right-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  color: white;
  font-size: 1rem;
  padding: 0 24px;
  transition: opacity 100ms ease-in-out;

  &:hover {
    opacity: 0.75;
  }

  &:focus {
    outline: 1px solid var(--color-theme-primary);
  }
`;

export function Taskbar() {
  const [showMenu, setShowMenu] = useState(false);

  const showContextMenu = useContextMenuStore((state) => state.show);

  const containerRef = useRef<HTMLDivElement>(document.createElement("div"));
  useOutsideClick(containerRef, () => {
    setShowMenu(false);
  });

  const onItemClick = useCallback(() => {
    setShowMenu(false);
  }, []);

  const taskbarMenuItems = useTaskbarContextMenu();
  const onContextMenu: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      showContextMenu(taskbarMenuItems, { x: e.clientX, y: e.clientY - 60 });
      return false;
    },
    [showContextMenu, taskbarMenuItems]
  );

  return (
    <div ref={containerRef}>
      <StartMenu show={showMenu} onItemClick={onItemClick} />
      <Box className={taskbarCss} justifyContent="space-between">
        <Box overflowX="hidden">
          <button
            className={startButtonCss}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faList} />
          </button>

          <OpenApplications />
        </Box>

        <Box onContextMenu={onContextMenu} flex={1} />

        <TaskbarWidgets />
      </Box>
    </div>
  );
}
