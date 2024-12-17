import { css } from "@emotion/css";
import cx from "classnames";
import { useCallback, useState } from "react";
import { useDesktopStore } from "../state/desktopState";
import { DesktopIcon as DesktopIconType } from "../types";
import { DesktopIconImage } from "./DesktopIconImage";
import { IconTitle } from "./IconTitle";

const containerCss = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 4px;
  gap: 4px;

  cursor: pointer;

  width: 60px;

  input {
    height: 20px;
    width: 100%;
  }

  &.selected,
  &:hover {
    background: #80bff7;
  }
`;

export interface IconProps {
  icon: DesktopIconType;
  selected: boolean;
  onContextMenu?: (pos: { x: number; y: number }) => void;
}

export function DesktopIcon(props: IconProps) {
  const {
    icon: { title: defaultTitle = "Icon", application, widget },
    selected,
    onContextMenu,
  } = props;
  const [title, setTitle] = useState(defaultTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // const clickTimerRef = useRef<number | null>(null);

  // const selectIcon = useIconStore((state) => state.selectIcon);
  // const unselectIcon = useIconStore((state) => state.unselectIcon);
  const addWindow = useDesktopStore((state) => state.addWidget);

  const onOpenWindow = useCallback(() => {
    addWindow({
      title,
      application,
      position: widget.position!,
      dimensions: widget.dimensions,
      resizable: widget.resizable,
    });
  }, [
    addWindow,
    application,
    title,
    widget.dimensions,
    widget.position,
    widget.resizable,
  ]);

  // const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
  //   (e) => {
  //     if (e.button === 2) {
  //       // right click
  //       selectIcon(id, false);
  //       return;
  //     }

  //     if (isEditingTitle) {
  //       return;
  //     }

  //     if (!selected) {
  //       selectIcon(id, e.ctrlKey);
  //       clickTimerRef.current = setTimeout(() => {
  //         clickTimerRef.current = null;
  //       }, 300);
  //       return;
  //     }

  //     if (clickTimerRef.current) {
  //       // double click
  //       clearTimeout(clickTimerRef.current);
  //       clickTimerRef.current = null;
  //       onOpenWindow();
  //       return;
  //     }

  //     if (e.ctrlKey) {
  //       unselectIcon(id, e.ctrlKey);
  //       return;
  //     }

  //     setIsEditingTitle(true);
  //   },
  //   [isEditingTitle, selected, selectIcon, id, onOpenWindow, unselectIcon]
  // );

  return (
    <div
      className={cx(containerCss, { selected })}
      // onMouseDown={onMouseDown}
      onDoubleClick={onOpenWindow}
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
