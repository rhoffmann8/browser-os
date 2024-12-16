import { UniqueIdentifier } from "@dnd-kit/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Application } from "./types/application";
import { Dispatch, SetStateAction } from "react";

export type Position = { x: number; y: number };
export type Delta = { x: number; y: number; top: number; left: number };

export type Dimensionable = {
  dimensions: { height?: number; width?: number };
};
export interface Moveable {
  position: Position;
}

export interface DesktopIcon extends Moveable {
  id: UniqueIdentifier;
  title: string;
  icon: IconProp;
  iconClassName?: string;

  widget: Partial<WidgetParams>;

  application: Application;
}

export interface WidgetParams extends Moveable, Partial<Dimensionable> {
  title: string;
  application: Application;
  resizable?: boolean;
}

export interface Widget extends WidgetParams {
  id: UniqueIdentifier;
  stackIndex: number;

  resize: (dims: Dimensionable["dimensions"]) => void;
  close: () => void;
}

export type Change<T> = SetStateAction<T>;
export type ChangeHandler<T> = Dispatch<SetStateAction<T>>;
