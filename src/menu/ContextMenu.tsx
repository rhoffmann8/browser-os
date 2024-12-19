import { css } from "@emotion/css";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useOutsideClick } from "rooks";
import { useContextMenuStore } from "../state/contextMenuState";
import { Position } from "../types";
import { ZIndex } from "../constants";

const menuCss = css`
  list-style: none;
  padding: 0;
  position: absolute;
  background: var(--color-theme-primary);
  font-size: 0.8rem;

  z-index: ${ZIndex.ContextMenu};

  cursor: pointer;

  li {
    padding: 4px 12px;
  }

  li:hover {
    background: var(--color-theme-hover);
  }
`;

export function ContextMenu() {
  const menuRef = useRef<HTMLUListElement>(document.createElement("ul"));

  const { items, visible, position, hide } = useContextMenuStore();

  useOutsideClick(menuRef, hide);

  const onItemClick = useCallback(
    (item: (typeof items)[number]) => {
      item.onClick();
      hide();
    },
    [hide]
  );

  const [coords, setCoords] = useState<{ top: number; left: number }>();
  // need to wait for menu dims to compute before normalizing position
  useLayoutEffect(() => {
    if (menuRef.current) {
      const { clientHeight: menuHeight, clientWidth: menuWidth } =
        menuRef.current ?? {};
      setCoords(getPosition(position, menuWidth, menuHeight));
    }
  }, [position]);

  if (!visible || !position) {
    return null;
  }

  return (
    <ul
      ref={menuRef}
      className={menuCss}
      style={{
        visibility: menuRef.current ? "visible" : "hidden",
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
      }}
    >
      {items.map((item) => (
        <li key={item.id} onClick={() => onItemClick(item)}>
          {item.title}
        </li>
      ))}
    </ul>
  );
}

// ensure menu is within window bounds
function getPosition(
  position: Position,
  width: number | undefined,
  height: number | undefined
) {
  if (width === undefined || height === undefined) {
    return undefined;
  }

  const left =
    position.x > window.innerWidth - width ? position.x - width : position.x;
  const top =
    position.y > window.innerHeight - height ? position.y - height : position.y;

  return { top, left };
}
