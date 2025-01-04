import { UniqueIdentifier } from "@dnd-kit/core";

export function updateItemInArray<T extends { id: UniqueIdentifier }>(
  arr: T[],
  id: UniqueIdentifier,
  updater: (item: T) => T
) {
  const itemIndex = arr.findIndex((w) => w.id === id);
  if (itemIndex === -1) return arr;
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

export function wait(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function omitBy(
  obj: Record<string, any>,
  keys: UniqueIdentifier[]
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
}
