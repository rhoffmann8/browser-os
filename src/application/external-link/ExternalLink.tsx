import { useEffect } from "react";
import { ApplicationComponent } from "../../types/application";
import { useDesktopStore } from "../../state/desktopState";

export const ExternalLink: ApplicationComponent<"external-link"> = ({
  window: appWindow,
  params: { url },
}) => {
  const closeWindow = useDesktopStore((state) => state.closeWindow);

  useEffect(() => {
    window.open(url);
    closeWindow(appWindow.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
