import { BrowserView, MobileView } from "react-device-detect";
import { Slide, ToastContainer } from "react-toastify";
import { ZIndex } from "./constants/constants";
import { DesktopView } from "./views/DesktopView";
import { Mobile } from "./views/MobileView";
import { ErrorBoundary } from "./system/components/ErrorBoundary";
import { InitializationBoundary } from "./system/components/InitializationBoundary";
import { configureSingle } from "@zenfs/core";
import { WebStorage } from "@zenfs/dom";
import { useEffect, useState } from "react";

function App() {
  const [backendInitialized, setBackendInitialized] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    setBackendError(null);
    configureSingle({ backend: WebStorage })
      .then(() => setBackendInitialized(true))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        setBackendError(message);
      });
  }, []);

  if (backendError) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#1a1a1a",
          color: "#eee",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ marginBottom: "1rem" }}>
          Failed to initialize storage: {backendError}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  if (!backendInitialized) return null;

  return (
    <>
      <ToastContainer
        position="top-center"
        transition={Slide}
        theme="dark"
        hideProgressBar
        autoClose={3000}
        style={{ zIndex: ZIndex.Toast }}
      />
      <ErrorBoundary>
        <InitializationBoundary>
          <BrowserView>
            <DesktopView />
          </BrowserView>

          <MobileView>
            <Mobile />
          </MobileView>
        </InitializationBoundary>
      </ErrorBoundary>
    </>
  );
}

export default App;
