import { DesktopIcon, WidgetParams } from "../types";

type CreateIconProps = {
  icon: Omit<DesktopIcon, "id" | "widget">;
  widget: Partial<WidgetParams>;
};

export function createIcon(props: CreateIconProps): DesktopIcon {
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
