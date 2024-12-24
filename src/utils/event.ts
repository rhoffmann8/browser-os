import { BaseSyntheticEvent } from "react";

export function stopEvent(e: BaseSyntheticEvent) {
  e.preventDefault();
  e.stopPropagation();
}
