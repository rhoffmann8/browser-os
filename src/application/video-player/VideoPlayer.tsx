import { css } from "@emotion/css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { BoxCol } from "../../components/Box";
import { Div } from "../../components/Div";
import { useForceUpdate } from "../../hooks/useForceUpdate";
import { useSetWidgetTitle } from "../../state/widgetState";
import { ApplicationComponent } from "../../types/application";
import { Navigation } from "./Navigation";
import { createVideoUrl, extractVideoFromUrl, Video } from "./utils";
import fs from "@zenfs/core";

export const VideoPlayer: ApplicationComponent = ({ widget }) => {
  const { filePath } = widget;
  const [prevFilePath, setPrevFilePath] = useState<string | undefined>();
  const [undoStack, setUndoStack] = useState<Video[]>([]);

  useEffect(() => {
    if (prevFilePath !== filePath) {
      if (filePath) {
        const videoInfo = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const { videoId, playlistId } = extractVideoFromUrl(videoInfo.params.url) ?? {};
        setUndoStack([{ videoId, playlistId, params: videoInfo.params }]);
      }
      setPrevFilePath(filePath);
    }
  }, [filePath, prevFilePath]);

  const [redoStack, setRedoStack] = useState<Video[]>([]);
  const currentVideo: Video | undefined = useMemo(
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

  const setTitle = useSetWidgetTitle();

  const reactPlayerRef = useRef<ReactPlayer>(null);
  const updateWidgetTitle = useCallback(() => {
    const internalPlayer = reactPlayerRef.current?.getInternalPlayer();
    if (!internalPlayer) return;
    const { title } = internalPlayer.getVideoData();
    setTitle(widget.id, title);
  }, [setTitle, widget.id]);

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
          url={currentVideo ? createVideoUrl(currentVideo) : undefined}
          config={
            currentVideo?.params
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
