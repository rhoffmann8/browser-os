import { css } from "@emotion/css";
import cx from "classnames";
import {
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { stopEvent } from "../utils/event";
import { Position } from "../types";
import { useOutsideClick } from "rooks";
import { Div } from "./Div";

export type ListItem<T = any> = { label: ReactNode; value: T };

interface Props<T> extends HTMLAttributes<HTMLUListElement> {
  items: ListItem<T>[];
  listItemProps?: HTMLAttributes<HTMLLIElement>;
  border?: boolean;
  shadow?: boolean;
  onItemClick?: (item: ListItem<T>, isKeyEvent: boolean) => void;
  contextMenuItems?: {
    title: string;
    onClick: (item: ListItem<T>) => void;
  }[];
}

export function List<T = any>(props: Props<T>) {
  const {
    items,
    className,
    listItemProps,
    border,
    shadow,
    onItemClick,
    contextMenuItems,
    ...rest
  } = props;

  const [focusedIndex, setFocusedIndex] = useState<number>();
  const listCss = useMemo(
    () => css`
      background: #111;
      ${shadow
        ? "box-shadow: 0px 1px 2px 0px var(--color-theme-secondary);"
        : ""}
      ${border ? "bord er: 1px solid var(--color-theme-primary);" : ""}

      &:focus {
        outline: 1px solid #aaa;
      }
    `,
    [border, shadow]
  );

  const onNavigate: KeyboardEventHandler<HTMLUListElement> = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        stopEvent(e);
        setFocusedIndex((prev) => Math.min(items.length - 1, (prev ?? -1) + 1));
      } else if (e.key === "ArrowUp") {
        stopEvent(e);
        setFocusedIndex((prev) => Math.max(0, (prev ?? items.length) - 1));
      } else if (e.key === "Enter" || e.key === " ") {
        stopEvent(e);
        onItemClick?.(items[focusedIndex ?? 0], true);
      }
    },
    [focusedIndex, items, onItemClick]
  );

  const [showContextMenu, setShowContextMenu] = useState<Position>();

  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(contextMenuRef, (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(undefined);
  });

  const onContextMenu: MouseEventHandler<HTMLUListElement> = useCallback(
    (e) => {
      if (!contextMenuItems) return;
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget;

      const listRect = currentTarget.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      const newPos = {
        x: e.pageX - listRect.x,
        y: e.pageY - listRect.y + rect.height,
      };
      setShowContextMenu(newPos);
      return false;
    },
    [contextMenuItems]
  );

  return (
    <ul
      className={cx(listCss, className)}
      tabIndex={0}
      onKeyDown={onNavigate}
      onContextMenu={onContextMenu}
      {...rest}
    >
      {items.map((item, index) => {
        return (
          <ListItem
            key={
              typeof item.value === "string" || typeof item.value === "number"
                ? item.value
                : index
            }
            index={index}
            item={item}
            focusedIndex={focusedIndex}
            listItemProps={listItemProps}
            onItemClick={() => {
              setFocusedIndex(index);
              onItemClick?.(item, false);
            }}
          />
        );
      })}

      {contextMenuItems && showContextMenu && (
        <Div ref={contextMenuRef}>
          <List
            style={{
              position: "absolute",
              top: showContextMenu.y,
              left: showContextMenu.x,
              transform: "translate(0, 50%)",
              zIndex: 1,
            }}
            // TODO: hacky -- fix
            onItemClick={(item) => {
              contextMenuItems
                .find((i) => i.title === item.label)
                // @ts-expect-error hack
                ?.onClick(item);
              setShowContextMenu(undefined);
            }}
            items={contextMenuItems.map((contextMenuItem) => {
              return {
                label: contextMenuItem.title,
                value: contextMenuItem,
              };
            })}
          />
        </Div>
      )}
    </ul>
  );
}

function ListItem<T>({
  item,
  index,
  focusedIndex,
  onItemClick,
  listItemProps,
}: {
  item: ListItem<T>;
  index: number;
  focusedIndex?: number;
  onItemClick?: (item: ListItem<T>) => void;
  listItemProps?: HTMLAttributes<HTMLLIElement>;
}) {
  const listItemRef = useRef<HTMLLIElement>(null);

  const listItemCss = useMemo(
    () => css`
      position: relative;
      padding: 4px 12px;
      transition: background-color 100ms linear;
      ${onItemClick ? "cursor: pointer;" : ""}

      &.focused {
        background-color: var(--color-theme-primary);
      }

      &:hover {
        ${onItemClick ? "background-color: var(--color-theme-hover);" : ""}
      }
    `,
    [onItemClick]
  );

  useEffect(() => {
    if (focusedIndex === index && listItemRef.current) {
      listItemRef.current.scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex, index]);

  return (
    <li
      ref={listItemRef}
      key={typeof item.value === "string" ? item.value : index}
      className={cx(
        listItemCss,
        { focused: focusedIndex === index },
        listItemProps?.className
      )}
      onClick={() => onItemClick?.(item)}
      {...listItemProps}
    >
      {item.label}
    </li>
  );
}
