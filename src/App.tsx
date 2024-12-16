import { Desktop } from "./Desktop";
import { ContextMenu } from "./menu/ContextMenu";
import { Taskbar } from "./taskbar/Taskbar";
import { Viewport } from "./Viewport";

function App() {
  return (
    <Viewport>
      <Desktop />
      <Taskbar />
      <ContextMenu />
    </Viewport>
  );
}

export default App;
