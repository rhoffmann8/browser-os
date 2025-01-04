import { useCallback, useState } from "react";

export function useUndoRedo<T>(initial: T | (() => T)) {
  const [undoStack, setUndoStack] = useState<T[]>([]);
  const [current, setCurrent] = useState<T>(initial);
  const [redoStack, setRedoStack] = useState<T[]>([]);

  const undo = useCallback(() => {
    if (!undoStack.length) return;
    const next = undoStack.at(-1)!;
    setRedoStack((prev) => prev.concat(current));
    setCurrent(next);
    setUndoStack((prev) => prev.slice(0, -1));
  }, [current, undoStack]);

  const redo = useCallback(() => {
    if (!redoStack.length) return;
    const next = redoStack.at(-1)!;
    setUndoStack((prev) => prev.concat(current));
    setCurrent(next);
    setRedoStack((prev) => prev.slice(0, -1));
  }, [current, redoStack]);

  const next = useCallback(
    (val: T) => {
      setUndoStack((prev) => prev.concat(current));
      setCurrent(val);
      setRedoStack([]);
    },
    [current]
  );

  return {
    undo,
    redo,
    next,
    current,
    isUndoDisabled: !undoStack.length,
    isRedoDisabled: !redoStack.length,
  };
}
