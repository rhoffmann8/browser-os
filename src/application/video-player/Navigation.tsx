import {
  faArrowLeft,
  faArrowRight,
  faRotateForward,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useMemo, useRef, useState } from "react";
import { Box } from "../../components/Box";
import { IconButton } from "../../components/IconButton";
import { createVideoUrl, extractVideoFromUrl, Video } from "./utils";
import { css } from "@emotion/css";

interface Props {
  currentVideo: Video;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onGo: (url: string | undefined) => void;
  undoStack: Video[];
  redoStack: Video[];
  isBackDisabled?: boolean;
  isForwardDisabled?: boolean;
}

export function Navigation({
  currentVideo,
  onBack,
  onForward,
  onReload,
  onGo: providedOnGo,
  undoStack,
  redoStack,
  isBackDisabled,
  isForwardDisabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(createVideoUrl(currentVideo) ?? "");

  const isGoDisabled = useMemo(() => {
    if (!input) return true;
    try {
      return !new URL(input).host.includes("youtube");
    } catch {
      return false;
    }
  }, [input]);

  const onGo = useCallback(
    (next: string) => {
      if (!next) return;
      const nextVideo = extractVideoFromUrl(next);
      if (!nextVideo) return;
      const nextUrl = createVideoUrl(nextVideo);
      providedOnGo(nextUrl);

      setInput((prev) => nextUrl ?? prev);
      inputRef.current?.blur();
    },
    [providedOnGo]
  );

  return (
    <Box
      gap={4}
      alignItems="center"
      style={{
        padding: 8,
        background: "var(--color-theme-gradient)",
        color: "white",
      }}
    >
      <Box gap={12}>
        <Box gap={4}>
          <IconButton
            title="Back"
            icon={faArrowLeft}
            className={buttonCss}
            disabled={isBackDisabled}
            onClick={() => {
              setInput(createVideoUrl(undoStack[undoStack.length - 2]) ?? "");
              onBack();
            }}
          />
          <IconButton
            title="Forward"
            icon={faArrowRight}
            className={buttonCss}
            disabled={isForwardDisabled}
            onClick={() => {
              const last = redoStack[redoStack.length - 1];
              setInput(createVideoUrl(last) ?? "");
              onForward();
            }}
          />
        </Box>
        <IconButton
          title="Reload"
          icon={faRotateForward}
          className={buttonCss}
          onClick={onReload}
        />
      </Box>
      <input
        ref={inputRef}
        className={inputCss}
        value={input}
        placeholder="Enter YouTube URL, video ID, or playlist ID"
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isGoDisabled) {
            e.preventDefault();
            e.stopPropagation();
            onGo(e.currentTarget.value);
          }
        }}
      />
      <IconButton
        title={isGoDisabled ? "Link is not a YouTube URL or video ID" : "Go"}
        disabled={isGoDisabled}
        icon={faShare}
        className={buttonCss}
        onClick={() => {
          if (inputRef.current?.value) onGo(inputRef.current?.value);
        }}
      />
    </Box>
  );
}

const inputCss = css`
  border: 1px solid var(--color-theme-primary);
  border-radius: 2rem;
  background: var(--color-theme-secondary);
  color: white;
  padding: 10px 12px;
  flex: 1;
  max-width: 500px;

  &:focus {
    outline: 1px solid var(--color-theme-hover);
  }
`;

const buttonCss = css`
  padding: 8px 16px;
  border-radius: 0.4rem;
`;
