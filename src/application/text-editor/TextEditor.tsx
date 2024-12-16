import { css } from "@emotion/css";
import { ApplicationComponent } from "../../types/application";
import { useEffect, useRef } from "react";

const editorCss = css`
  height: 100%;
  width: 100%;

  outline: none;

  padding: 2px 4px;

  font-size: 14px;
  line-height: 1.2;

  border: none;
  resize: none;

  background: transparent;
  color: black;
`;

export const TextEditor: ApplicationComponent<"text-editor"> = ({
  params: { content, readonly },
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  if (!readonly) {
    return (
      <textarea
        ref={inputRef}
        placeholder="Your text goes here"
        defaultValue={content}
        className={editorCss}
      />
    );
  }

  return <div className={editorCss}>{content}</div>;
};
