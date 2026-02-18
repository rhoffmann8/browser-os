import { ErrorBoundary as LibErrorBoundary, FallbackProps } from "react-error-boundary";
import { PropsWithChildren } from "react";
import { BSOD } from "./BSOD";

function BSODFallback({ error }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);
  return <BSOD error={message} />;
}

export function ReactErrorBoundary({ children }: PropsWithChildren) {
  return (
    <LibErrorBoundary FallbackComponent={BSODFallback}>
      {children}
    </LibErrorBoundary>
  );
}
