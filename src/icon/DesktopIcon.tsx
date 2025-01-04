import { css } from "@emotion/css";
import cx from "classnames";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import { useIconContextMenu } from "../menu/hooks/useIconContextMenu";
import { useContextMenuStore } from "../state/contextMenuState";
import {
  DesktopIcon as DesktopIconType,
  WidgetSettings,
} from "../types/widget";
import { DesktopIconImage } from "./DesktopIconImage";
import { IconTitle } from "./IconTitle";
import { useOutsideClick } from "rooks";

const containerCss = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 60px;
  padding: 4px;
  gap: 4px;

  cursor: pointer;

  border: 1px solid transparent;

  input {
    height: 20px;
    width: 100%;
  }

  &:hover,
  &.selected {
    border: 1px solid rgb(128, 192, 247);
  }

  &:hover {
    background: rgba(128, 191, 247, 0.5);
  }

  &.selected {
    background: rgba(128, 191, 247, 0.75);
  }
`;

export interface IconProps {
  icon: DesktopIconType;
  className?: string;
  titleClassName?: string;
  selected?: boolean;
  // onContextMenu?: (pos: { x: number; y: number }) => void;
  onClick?: (id: string, append: boolean) => void;
  onDoubleClick?: (widget: WidgetSettings) => void;
  onOutsideClick?: () => void;
}

export function DesktopIcon(props: IconProps) {
  const {
    icon: { description, title: defaultTitle = "Icon", widget, id },
    className,
    titleClassName,
    selected,
    onClick,
    onDoubleClick,
    onOutsideClick,
  } = props;
  const [title, setTitle] = useState(defaultTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, onOutsideClick ?? (() => {}));

  // const clickTimerRef = useRef<number | null>(null);

  // const selectIcon = useIconStore((state) => state.selectIcon);
  // const unselectIcon = useIconStore((state) => state.unselectIcon);
  // const addWidget = useWidgetStore((state) => state.addWidget);

  const iconContextMenuItems = useIconContextMenu(props.icon);
  const showContextMenu = useContextMenuStore((state) => state.show);

  const onOpenWindow: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      onDoubleClick?.(widget);
    },
    [onDoubleClick, widget]
  );

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
      ref={containerRef}
      className={cx(containerCss, { selected }, className)}
      title={description}
      // onMouseDown={onMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id, false);
        // selectIcon(id, false);
      }}
      onDoubleClick={onOpenWindow}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(iconContextMenuItems, { x: e.pageX, y: e.pageY });
        // onContextMenu?.({ x: e.pageX, y: e.pageY });
        return false;
      }}
    >
      <DesktopIconImage icon={props.icon} />
      <IconTitle
        title={title}
        selected={selected}
        isEditing={isEditingTitle}
        className={titleClassName}
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
