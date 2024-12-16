import { UniqueIdentifier } from "@dnd-kit/core";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Icon, Position, WidgetParams } from "./types";
import { Application } from "./types/application";

export function randomRgba(opacity: number) {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function getStorageJSON(key: string) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function updateItemInArray<T extends { id: UniqueIdentifier }>(
  arr: T[],
  id: UniqueIdentifier,
  updater: (item: T) => T
) {
  const itemIndex = arr.findIndex((w) => w.id === id);
  if (itemIndex === -1) return arr;
  // return arr.filter((w) => w.id !== id).concat(updater(item));
  return arr.map((item, idx) => {
    if (idx === itemIndex) {
      return updater(item);
    }
    return item;
  });
}

export function toggleArrayItem<T>(arr: T[], itemToToggle: T) {
  const curr = arr.find((i) => i === itemToToggle);
  return curr ? arr.filter((i) => i !== itemToToggle) : [...arr, itemToToggle];
}

export function createIcon<A extends Application>(
  title: string,
  application: A,
  icon: IconDefinition,
  iconPosition: Position,
  widget: Partial<WidgetParams>
): Icon {
  return {
    id: crypto.randomUUID(),
    title,
    application,
    icon,
    position: iconPosition,
    widget,
  };
}

let canvasCache: HTMLCanvasElement;
export function getTextWidth(text: string, font: string) {
  // re-use canvas object for better performance
  const canvas =
    canvasCache || (canvasCache = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) {
    return 0;
  }

  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}
