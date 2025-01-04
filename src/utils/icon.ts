import { DesktopIcon, WidgetSettings } from "../types/widget";

type CreateIconProps = {
  icon: Omit<DesktopIcon, "id" | "widget">;
  widget: WidgetSettings;
};

export function createIcon(props: CreateIconProps): DesktopIcon {
  const { icon, widget } = props;

  return {
    id: crypto.randomUUID(),
    title: icon.title,
    description: icon.description,
    icon: icon.icon,
    iconClassName: icon.iconClassName,
    position: icon.position,
    widget,
  };
}
