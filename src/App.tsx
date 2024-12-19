import { PropsWithChildren, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { Slide, toast, ToastContainer } from "react-toastify";
import { Desktop } from "./Desktop";
import { ContextMenu } from "./menu/ContextMenu";
import { Mobile } from "./Mobile";
import { Taskbar } from "./taskbar/Taskbar";
import { Viewport } from "./Viewport";
import { ZIndex } from "./constants";

function App() {
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
        <BrowserView>
          <Viewport>
            <Desktop />
            <Taskbar />
            <ContextMenu />
          </Viewport>
        </BrowserView>

        <MobileView>
          <Mobile />
        </MobileView>
      </ErrorBoundary>
    </>
  );
}

function ErrorBoundary({ children }: PropsWithChildren) {
  useGlobalErrorHandling();

  return <>{children}</>;
}

function useGlobalErrorHandling() {
  useEffect(() => {
    const listener = (e: ErrorEvent) => toast.error(e.message);
    window.addEventListener("error", listener);

    return () => window.removeEventListener("error", listener);
  }, []);
}

export default App;
