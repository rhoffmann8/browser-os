import { PropsWithChildren } from "react";
import { useGlobalErrorHandling } from "../hooks/useGlobalErrorHandling";
import { BSOD } from "./BSOD";
import { ReactErrorBoundary } from "./ReactErrorBoundary";

export function ErrorBoundary({ children }: PropsWithChildren) {
  const error = useGlobalErrorHandling();
  if (error) return <BSOD error={error} />;
  return <ReactErrorBoundary>{children}</ReactErrorBoundary>;
}
