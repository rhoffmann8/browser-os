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

  useEffect(() => {
    configureSingle({ backend: WebStorage }).then(() =>
      setBackendInitialized(true)
    );
  }, []);

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
