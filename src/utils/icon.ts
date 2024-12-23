import { DesktopIcon, WidgetParams } from "../types";
import { Application } from "../types/application";

type CreateIconProps<A extends Application> = {
  icon: Omit<DesktopIcon<A>, "id" | "widget">;
  widget: Partial<WidgetParams<A>>;
};

export function createIcon<A extends Application>(
  props: CreateIconProps<A>
): DesktopIcon<A> {
  const { icon, widget } = props;

  return {
    id: crypto.randomUUID(),
    title: icon.title,
    description: icon.description,
    application: icon.application,
    icon: icon.icon,
    iconClassName: icon.iconClassName,
    position: icon.position,
    widget,
  };
}
