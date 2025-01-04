import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Dispatch, SetStateAction } from "react";
import { ApplicationId } from "./application";

export type Position = { x: number; y: number };
export type Dimensions = { height?: number; width?: number };
export type Delta = { x: number; y: number; top: number; left: number };

export interface DesktopIcon {
  id: string;
  icon: IconProp;
  title?: string;
  description?: string;
  iconClassName?: string;

  position: Position;

  widget: WidgetSettings;
}

export interface WidgetSettings {
  applicationId: ApplicationId;
  params?: any;
  filePath?: string;

  title?: string;
  isResizable?: boolean;
  isSingleInstance?: boolean;

  position: Position;
  dimensions?: Dimensions;
}

export interface Widget extends WidgetSettings {
  id: string;
  stackIndex: number;
}

export type Change<T> = SetStateAction<T>;
export type ChangeHandler<T> = Dispatch<SetStateAction<T>>;
