import { useMemo, useState } from "react";

export function useForceUpdate() {
  const [updateCount, forceUpdate] = useState(0);

  return useMemo(
    () => ({
      updateCount,
      forceUpdate: () => forceUpdate((prev) => prev + 1),
    }),
    [updateCount]
  );
}
