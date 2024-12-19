import { Desktop } from "../Desktop";
import { ContextMenu } from "../menu/ContextMenu";
import { Taskbar } from "../taskbar/Taskbar";
import { Viewport } from "../Viewport";

export function DesktopView() {
  return (
    <Viewport>
      <Desktop />
      <Taskbar />
      <ContextMenu />
    </Viewport>
  );
}
