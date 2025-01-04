import { css } from "@emotion/css";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Box, BoxCol } from "../../../components/Box";
import { generateIconPos } from "../../../constants/icons";
import { useUndoRedo } from "../../../hooks/useUndoRedo";
import { DesktopIcon as DesktopIconComponent } from "../../../icon/DesktopIcon";
import {
  useAddWidget,
  useSetWidgetFilePath,
  useSetWidgetTitle,
} from "../../../state/widgetState";
import { ApplicationId } from "../../../types/application";
import { DesktopIcon, Widget } from "../../../types/widget";
import {
  fsAsync,
  getApplicationIdForFileType,
  getFileType,
  getIconForFileType,
} from "../../utils/fs";
import { Toolbar } from "./Toolbar";

const noTextShadowCss = css`
  text-shadow: none;
`;

const iconClassName = css`
  filter: none;

  path {
    fill: var(--color-theme-primary);
  }
`;

async function getIconsForPath(
  path: string | undefined
): Promise<DesktopIcon[]> {
  if (!path) return [];

  const files = await fsAsync.readdir(path);
  return Promise.all(
    files.map(async (file) => {
      const { name } = file;
      const fileType = getFileType(name);
      const applicationId = getApplicationIdForFileType(fileType);
      const realpath = await fsAsync.realpath(`/${path}/${name}`);

      return {
        id: crypto.randomUUID(),
        title: name,
        icon: file.isDirectory() ? faFolder : getIconForFileType(fileType),
        iconClassName,
        position: generateIconPos(),
        widget: {
          applicationId,
          position: { x: 100, y: 100 },
          title: name,
          filePath: realpath,
          isSingleInstance: applicationId === ApplicationId.MusicPlayer,
        },
      };
    })
  );
}

export function Explorer({
  widget,
  isDesktop,
}: {
  widget: Widget;
  isDesktop?: boolean;
}) {
  const { id, filePath = "/" } = widget;
  const [icons, setIcons] = useState<DesktopIcon[]>([]);

  const addWidget = useAddWidget();
  const setWidgetTitle = useSetWidgetTitle();
  const setFilePath = useSetWidgetFilePath();

  const undoRedoStack = useUndoRedo(filePath);
  const { next, current } = undoRedoStack;

  useEffect(() => {
    getIconsForPath(current).then((icons) => {
      setIcons(icons);
    });
  }, [current, id]);

  const setWidgetTitleFromPath = useCallback(
    (path: string) => {
      return fsAsync.realpath(`/${path}`).then((p) => setWidgetTitle(id, p));
    },
    [id, setWidgetTitle]
  );

  useEffect(() => {
    const watcher = fsAsync.watch(current ? current : "/", () => {
      getIconsForPath(current).then(setIcons);
    });
    return () => watcher.close();
  }, [current, setWidgetTitleFromPath]);

  const sortedIcons = useMemo(() => {
    return icons.slice().sort((a, b) => {
      if (a.icon === faFolder && b.icon !== faFolder) return -1;
      if (a.icon !== faFolder && b.icon === faFolder) return 1;
      if (a.title && b.title) return a.title.localeCompare(b.title);
      return 0;
    });
  }, [icons]);

  useEffect(() => {
    setFilePath(id, current);
    setWidgetTitleFromPath(current);
  }, [id, setFilePath, current, setWidgetTitleFromPath]);

  const [selectedIcons, setSelectedIcons] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSelected = useCallback((id: string, value: boolean) => {
    setSelectedIcons((prev) => {
      const copy = {
        ...Object.fromEntries(
          Object.entries(prev).map(([_id]) => [_id, false])
        ),
      };
      copy[id] = value;
      return copy;
    });
  }, []);

  return (
    <BoxCol style={{ flex: 1 }}>
      <Suspense fallback={<>Test</>}>
        <Toolbar {...undoRedoStack} />
      </Suspense>
      <Box flex={1} gap={8} alignItems="start" padding={"4px 8px"}>
        {sortedIcons.map((icon) => (
          <DesktopIconComponent
            key={icon.id}
            icon={icon}
            selected={!!selectedIcons[icon.id]}
            onClick={(id) => toggleSelected(id, true)}
            onOutsideClick={() => toggleSelected(id, false)}
            titleClassName={noTextShadowCss}
            onDoubleClick={async (nextWidget) => {
              if (!nextWidget.filePath) {
                // TODO: handle
                return;
              }
              const stat = await fsAsync.stat(nextWidget.filePath);
              if (!isDesktop && stat.isDirectory()) {
                next(nextWidget.filePath);
              } else {
                addWidget(nextWidget);
              }
            }}
          />
        ))}
      </Box>
    </BoxCol>
  );
}
