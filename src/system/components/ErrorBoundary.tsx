import { PropsWithChildren } from "react";
import { useGlobalErrorHandling } from "../hooks/useGlobalErrorHandling";
import { BSOD } from "./BSOD";

export function ErrorBoundary({ children }: PropsWithChildren) {
  const error = useGlobalErrorHandling();
  return <>{error ? <BSOD error={error} /> : children}</>;
}
