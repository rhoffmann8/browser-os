import { css } from "@emotion/css";
import { useCallback, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { BoxCol } from "../../components/Box";
import { Div } from "../../components/Div";
import {
  ApplicationComponent,
  VideoPlayerApplication,
} from "../../types/application";
import { Navigation } from "./Navigation";
import { createVideoUrl, extractVideoFromUrl, Video } from "./utils";
import { useForceUpdate } from "../../hooks/useForceUpdate";

export const VideoPlayer: ApplicationComponent<VideoPlayerApplication> = ({
  widget,
  params: { url: defaultUrl, start: defaultStart },
}) => {
  const [undoStack, setUndoStack] = useState<Video[]>(() => {
    const { videoId, playlistId } = extractVideoFromUrl(defaultUrl) ?? {};
    return videoId
      ? [{ videoId, playlistId, params: { start: defaultStart } }]
      : [];
  });
  const [redoStack, setRedoStack] = useState<Video[]>([]);
  const currentVideo = useMemo(
    () => undoStack[undoStack.length - 1],
    [undoStack]
  );

  const onGo = useCallback(
    (nextUrl: string | undefined) => {
      if (!nextUrl) return;
      const nextVideo = extractVideoFromUrl(nextUrl);
      if (!nextVideo) return;
      const prevUrl = undoStack[undoStack.length - 1]
        ? createVideoUrl(undoStack[undoStack.length - 1])
        : undefined;
      if (!nextUrl || nextUrl === prevUrl) return;
      setUndoStack((prev) => prev.concat(nextVideo));
      setRedoStack([]);
    },
    [undoStack]
  );

  const onBack = useCallback(() => {
    const last = undoStack[undoStack.length - 1];
    setRedoStack((prev) => (last ? [...prev, last] : prev));
    setUndoStack((prev) => prev.slice(0, -1));
  }, [undoStack]);

  const onForward = useCallback(() => {
    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => {
      return last ? [...prev, last] : prev;
    });
  }, [redoStack]);

  const reactPlayerRef = useRef<ReactPlayer>(null);
  const updateWidgetTitle = useCallback(() => {
    const internalPlayer = reactPlayerRef.current?.getInternalPlayer();
    if (!internalPlayer) return;
    const { title } = internalPlayer.getVideoData();
    widget.setTitle(title);
  }, [widget]);

  const { forceUpdate, updateCount: playerKey } = useForceUpdate();

  return (
    <BoxCol fillWidth>
      <Navigation
        currentVideo={currentVideo}
        isBackDisabled={undoStack.length <= 1}
        isForwardDisabled={!redoStack.length}
        onGo={onGo}
        onBack={onBack}
        onForward={onForward}
        onReload={forceUpdate}
        undoStack={undoStack}
        redoStack={redoStack}
      />
      <Div className={videoContainerCss} fillHeight fillWidth>
        <ReactPlayer
          key={playerKey}
          playing
          controls
          url={createVideoUrl(currentVideo) ?? undefined}
          config={
            currentVideo.params
              ? {
                  youtube: { playerVars: currentVideo?.params },
                }
              : undefined
          }
          ref={reactPlayerRef}
          height="100%"
          width="100%"
          onPlay={updateWidgetTitle}
        />
      </Div>
    </BoxCol>
  );
};

const videoContainerCss = css`
  padding: 0 4px;
  background: black;
`;
