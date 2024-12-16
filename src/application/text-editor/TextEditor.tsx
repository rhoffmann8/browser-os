import { css } from "@emotion/css";
import { ApplicationComponent } from "../../types/application";

const editorCss = css`
  height: 100%;
  width: 100%;

  outline: none;

  padding: 2px 4px;

  font-size: 14px;
  line-height: 1.2;
`;

export const TextEditor: ApplicationComponent<"textEditor"> = ({
  params: { content },
}) => {
  return (
    <div className={editorCss} contentEditable suppressContentEditableWarning>
      {content}
    </div>
  );
};
