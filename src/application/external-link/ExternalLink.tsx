import { useEffect } from "react";
import {
  ApplicationComponent,
  ExternalLinkApplication,
} from "../../types/application";

export const ExternalLink: ApplicationComponent<ExternalLinkApplication> = ({
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
