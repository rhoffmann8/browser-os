import { useEffect } from "react";
import { ApplicationComponent } from "../../types/application";
import { useWidgetStore } from "../../state/widgetState";

export const ExternalLink: ApplicationComponent = ({ widget: widget }) => {
  const {
    id,
    params: { url },
  } = widget;

  const close = useWidgetStore((state) => state.closeWidget);

  useEffect(() => {
    window.open(url);
    close(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
