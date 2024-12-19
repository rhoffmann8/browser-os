import { StorageKeys } from "../constants";

export function getStorageJSON(key: StorageKeys) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  } catch {
    return null;
  }
}
