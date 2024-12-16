import { useEffect } from "react";
import { ApplicationComponent } from "../../types/application";

export const ExternalLink: ApplicationComponent<"external-link"> = ({
  widget: appWindow,
  params: { url },
}) => {
  useEffect(() => {
    window.open(url);
    appWindow.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
