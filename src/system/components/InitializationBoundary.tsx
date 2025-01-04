import { PropsWithChildren, useEffect, useState } from "react";
import { fsAsync } from "../utils/fs";

import { createDefaultIcons } from "../../constants/icons";
import { useIconStore } from "../../state/iconState";
import track5 from "/music/Noru - Majestic Sky.mp3";
import track1 from "/music/Josef Surikov - Meditation Ambience.mp3";
import track2 from "/music/Ashot Danielyan - Meditation For Relax.mp3";
import track3 from "/music/Ashot Danielyan - Nirvikalpa.mp3";
import track4 from "/music/Sergei Chetvertnykh - Weightlessness.mp3";

export function InitializationBoundary({ children }: PropsWithChildren) {
  const setIcons = useIconStore((state) => state.setIcons);
  const [_isInitialized, setIsInitialized] = useState(isInitialized());
  useEffect(() => {
    if (isInitialized()) return;
    (async () => {
      await initializeMusic();
      await fsAsync.mkdir("/notes");

      setIcons(createDefaultIcons());

      localStorage.setItem("initialized", "true");
      setIsInitialized(true);
    })();
  }, [setIcons]);

  return _isInitialized ? <>{children}</> : null;
}

async function initializeMusic() {
  await fsAsync.mkdir("/music");
  await fsAsync.writeFile(
    "/music/Josef Surikov - Meditation Ambience.mp3",
    Buffer.from(track1)
  );
  await fsAsync.writeFile(
    "/music/Ashot Danielyan - Meditation For Relax.mp3",
    Buffer.from(track2)
  );
  await fsAsync.writeFile(
    "/music/Ashot Danielyan - Nirvikalpa.mp3",
    Buffer.from(track3)
  );
  await fsAsync.writeFile(
    "/music/Sergei Chetvertnykh - Weightlessness.mp3",
    Buffer.from(track4)
  );
  await fsAsync.writeFile(
    "/music/Noru - Majestic Sky.mp3",
    Buffer.from(track5)
  );
}

function isInitialized() {
  return localStorage.getItem("initialized") === "true";
}
