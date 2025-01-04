import { useEffect } from "react";
import { useSetWidgetDimensions } from "../state/widgetState";
import { Dimensions, Widget } from "../types/widget";

export function useAutosizeOnLoad(
  widget: Widget,
  dimensions: Required<Dimensions>
) {
  const { id } = widget;
  const setWidgetDimensions = useSetWidgetDimensions();

  useEffect(() => {
    if (!widget.dimensions) {
      setWidgetDimensions(id, dimensions);
    }
  }, [dimensions, id, setWidgetDimensions, widget.dimensions]);
}
