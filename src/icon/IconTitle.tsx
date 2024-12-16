import { css } from "@emotion/css";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box } from "../components/Box";

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
  font-size: 12px;
  line-height: 1.2;
  text-shadow: 1px 1px #000;
`;

interface Props {
  title: string;
  isEditing: boolean;
  onUpdate: (next: string) => void;
  onCancel: () => void;
}

export function IconTitle({ isEditing, title, onUpdate, onCancel }: Props) {
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
    return <Box className={displayCss}>{title}</Box>;
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
