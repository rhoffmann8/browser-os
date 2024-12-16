import { css } from "@emotion/css";
import cx from "classnames";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import { useIconStore } from "../state/iconState";
import { Icon } from "../types";
import { DesktopIconImage } from "./DesktopIconImage";
import { IconTitle } from "./IconTitle";
import { useDesktopStore } from "../state/desktopState";

const containerCss = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: 4px;

  cursor: pointer;

  height: 80px;
  width: 80px;

  img {
    height: 48px;
    width: 48px;
  }

  input {
    height: 20px;
    width: 100%;
  }

  &.selected,
  &:hover {
    /* outline: 1px solid var(--color-theme-hover); */
    background: #80bff7;
  }
`;

export interface IconProps {
  icon: Icon;
  selected: boolean;
  onContextMenu?: (pos: { x: number; y: number }) => void;
}

export function DesktopIcon(props: IconProps) {
  const {
    icon: { id, title: defaultTitle = "Icon", application, window },
    selected,
    onContextMenu,
  } = props;
  const [title, setTitle] = useState(defaultTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const clickTimerRef = useRef<number | null>(null);

  const selectIcon = useIconStore((state) => state.selectIcon);
  const unselectIcon = useIconStore((state) => state.unselectIcon);
  const addWindow = useDesktopStore((state) => state.addWindow);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.button === 2) {
        // right click
        selectIcon(id, false);
        return;
      }

      if (isEditingTitle) {
        return;
      }

      if (!selected) {
        selectIcon(id, e.ctrlKey);
        clickTimerRef.current = setTimeout(() => {
          clickTimerRef.current = null;
        }, 300);
        return;
      }

      if (clickTimerRef.current) {
        // double click
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
        addWindow({
          id: crypto.randomUUID(),
          title,
          application,
          position: window.position,
          height: window.height,
          width: window.width,
        });
        return;
      }

      if (e.ctrlKey) {
        unselectIcon(id, e.ctrlKey);
        return;
      }

      setIsEditingTitle(true);
    },
    [
      addWindow,
      application,
      id,
      isEditingTitle,
      selectIcon,
      selected,
      title,
      unselectIcon,
      window.height,
      window.position,
      window.width,
    ]
  );

  return (
    <div
      className={cx(containerCss, { selected })}
      onMouseDown={onMouseDown}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.({ x: e.pageX, y: e.pageY });
        return false;
      }}
    >
      <DesktopIconImage icon={props.icon} />
      <IconTitle
        title={title}
        isEditing={isEditingTitle}
        onCancel={() => setIsEditingTitle(false)}
        onUpdate={(next) => {
          setIsEditingTitle(false);
          setTitle(next);
        }}
      />
    </div>
  );
}

// function useClickOrDoubleClick(handlers: {onClick: () => void, onDoubleClick: () => void}, disabled?: boolean;) {
//   const clickTimerRef = useRef<number | null>(null);

//   const onMouseDown = useCallback(() => {
//     if (disabled) {
//       return;
//     }

//     if (!selected) {
//       onSelect?.(id);
//       clickTimerRef.current = setTimeout(() => {
//         clickTimerRef.current = null;
//       }, 300);
//       return;
//     }

//     if (clickTimerRef.current) {
//       // double click
//       clearTimeout(clickTimerRef.current);
//       clickTimerRef.current = null;

//       handlers.onDoubleClick();
//       return;
//     }

//     handlers.onClick();
//     setIsEditingTitle(true);
//   }, [id, selected, isEditingTitle, onSelect]);

//   return
// }
