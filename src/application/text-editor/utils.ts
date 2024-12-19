import { StorageKeys } from "../../constants";
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
