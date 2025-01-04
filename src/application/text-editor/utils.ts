import { StorageKeys } from "../../constants/constants";
import { fsAsync } from "../../system/utils/fs";
import { updateItemInArray } from "../../utils/array";
import { getStorageJSON } from "../../utils/storage";
import { Note } from "./TextEditor";

export function writeFile(
  id: string | undefined,
  title: string,
  content: string
): Note {
  const notes: Note[] = getStorageJSON(StorageKeys.NOTES) ?? [];
  const noteToSave: Note = { id: id ?? crypto.randomUUID(), title, content };

  localStorage.setItem(
    StorageKeys.NOTES,
    JSON.stringify(
      id
        ? updateItemInArray(notes, id, () => noteToSave)
        : notes.concat(noteToSave)
    )
  );

  return noteToSave;
}

export function deleteFile(id: string) {
  const notes: Note[] = getStorageJSON(StorageKeys.NOTES) ?? [];
  localStorage.setItem(
    StorageKeys.NOTES,
    JSON.stringify(notes.filter((n) => n.id !== id))
  );
}

export async function getFile(path: string): Promise<string | undefined> {
  if (!path) return undefined;
  try {
    const defaultFile = await fsAsync.readFile(path);
    const text = defaultFile.toString();
    return text;
  } catch {
    return undefined;
  }
}

export function saveFile(path: string, content: string) {
  return fsAsync.writeFile(path, Buffer.from(content));
}
