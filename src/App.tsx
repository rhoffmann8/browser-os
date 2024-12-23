import { PropsWithChildren, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { Slide, toast, ToastContainer } from "react-toastify";
import { ZIndex } from "./constants/constants";
import { Mobile } from "./views/MobileView";
import { DesktopView } from "./views/DesktopView";

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
          <DesktopView />
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
