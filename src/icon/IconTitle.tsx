import { css } from "@emotion/css";
import cx from "classnames";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Div } from "../components/Div";

const inputCss = css`
  color: white;
  border: none;
  text-align: center;
  background: transparent;

  &:focus {
    outline: none;
    background: var(--color-theme-hover);
  }
`;

const displayCss = css`
  flex-wrap: wrap;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;

  text-overflow: ellipsis;
  overflow: hidden;

  visibility: visible;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  &.selected {
    display: flex;
  }

  &.shadow {
    text-shadow: 0px 1px 2px #000;
  }
`;

interface Props {
  title: string;
  isEditing: boolean;
  selected?: boolean;
  className?: string;
  onUpdate: (next: string) => void;
  onCancel: () => void;
}

export function IconTitle({
  isEditing,
  title,
  selected,
  className,
  onUpdate,
  onCancel,
}: Props) {
  const [workingTitle, setWorkingTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  const onTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const next = e.currentTarget.value;
      setWorkingTitle(next);
    },
    []
  );

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.stopPropagation();
        onUpdate(workingTitle);
      }

      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
        setWorkingTitle(title);
      }
    },
    [onUpdate, workingTitle, onCancel, title]
  );

  if (!isEditing) {
    return (
      <Div className={cx(displayCss, { selected }, className)}>{title}</Div>
    );
  }

  return (
    <input
      ref={inputRef}
      className={inputCss}
      disabled={!isEditing}
      value={isEditing ? workingTitle : title}
      onKeyDown={onKeyDown}
      onChange={onTitleChange}
      onBlur={() => onCancel()}
      style={{ pointerEvents: !isEditing ? "none" : undefined }}
    />
  );
}
