import { UniqueIdentifier } from "@dnd-kit/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Application } from "./types/application";

export type Position = { x: number; y: number };
export type Delta = { x: number; y: number; top: number; left: number };
export type Dimensionable = { height: number; width: number };

export interface Positionable {
  position: Position;
}

export interface Icon extends Positionable {
  id: UniqueIdentifier;
  title: string;
  icon: IconProp;

  window: Dimensionable & Positionable;

  application: Application;
}

export interface DesktopWindow extends Positionable, Dimensionable {
  id: UniqueIdentifier;
  title: string;

  stackIndex: number;

  application: Application;
}
