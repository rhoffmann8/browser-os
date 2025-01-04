import { useState, useEffect } from "react";

export function useGlobalErrorHandling() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listener = (e: ErrorEvent) => {
      setError(e.message);
    };
    window.addEventListener("error", listener);
    return () => window.removeEventListener("error", listener);
  }, []);

  return error;
}
