import { UniqueIdentifier } from "@dnd-kit/core";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Position, Dimensionable, Positionable } from "./types";
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
  position: Position,
  windowDimensions: Dimensionable & Positionable
) {
  return {
    id: crypto.randomUUID(),
    title,
    application,
    icon,
    position,
    window: windowDimensions,
  };
}
