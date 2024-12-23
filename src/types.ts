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

export interface DesktopIcon<A extends Application> extends Moveable {
  id: UniqueIdentifier;
  title?: string;
  description?: string;
  icon: IconProp;
  iconClassName?: string;

  widget: Partial<WidgetParams<A>>;

  application: A;
}

export interface WidgetParams<A extends Application>
  extends Moveable,
    Partial<Dimensionable> {
  application: A;
  title?: string;
  resizable?: boolean;
}

export interface Widget<A extends Application = Application>
  extends WidgetParams<A> {
  id: UniqueIdentifier;
  stackIndex: number;

  isActive: () => boolean;
  moveToTop: () => void;
  resize: (dims: Dimensionable["dimensions"]) => void;
  setTitle: (title: string) => void;
  setPosition: (next: Position) => void;
  setApplication: (next: Application) => void;
  close: () => void;
}

export type Change<T> = SetStateAction<T>;
export type ChangeHandler<T> = Dispatch<SetStateAction<T>>;
