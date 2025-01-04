import { css } from "@emotion/css";
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Box } from "../../../components/Box";
import { IconButton } from "../../../components/IconButton";
import { getButtonBackgroundGradientStyles } from "../../../utils/style";
import { fsAsync } from "../../utils/fs";
import { useEffect, useState } from "react";

const { normal } = getButtonBackgroundGradientStyles(
  "var(--color-theme-primary)"
);
const toolbarCss = css`
  background: ${normal};
  box-shadow: 0 1px 2px black;

  button {
    padding: 4px 6px;
    box-shadow: none;
  }
`;
const transparentBgCss = css`
  background: transparent;
`;

interface Props {
  current: string;
  undo: () => void;
  redo: () => void;
  next: (path: string) => void;
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
}

export function Toolbar({
  isRedoDisabled,
  isUndoDisabled,
  redo,
  undo,
  next,
  current,
}: Props) {
  const [isUpDisabled, setIsUpDisabled] = useState(false);

  useEffect(() => {
    fsAsync
      .realpath(current ? current : "/")
      .then((path) => setIsUpDisabled(path === "/"));
  }, [current]);

  return (
    <Box className={toolbarCss} gap={8}>
      <div>
        <IconButton
          title="Back"
          icon={faArrowLeft}
          iconProps={{ size: "2x" }}
          disabled={isUndoDisabled}
          className={transparentBgCss}
          onClick={undo}
        />
        <IconButton
          title="Forward"
          icon={faArrowRight}
          iconProps={{ size: "2x" }}
          disabled={isRedoDisabled}
          className={transparentBgCss}
          onClick={redo}
        />
      </div>
      <IconButton
        title="Up"
        icon={faArrowUp}
        iconProps={{ size: "2x" }}
        disabled={isUpDisabled}
        className={transparentBgCss}
        onClick={() => next(`${current}/..`)}
      />
    </Box>
  );
}
