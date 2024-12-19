import { toast } from "react-toastify";
import { Box } from "../../../components/Box";
import { TextEditorApplication } from "../../../types/application";
import { toolbarCss } from "../styles";
import { writeFile, deleteFile } from "../utils";
import { OpenButton } from "./toolbar-buttons/OpenButton";
import { SaveButton } from "./toolbar-buttons/SaveButton";
import { useDesktopStore } from "../../../state/desktopState";
import { useState } from "react";
import { Note } from "../TextEditor";
import { ChangeHandler, Widget } from "../../../types";

interface Props {
  widget: Widget;
  defaultActiveFile: Note | undefined;
  content: string;
  onContentChange: ChangeHandler<string>;
}

export function Toolbar({
  widget,
  defaultActiveFile,
  content,
  onContentChange,
}: Props) {
  const setWidgetApplication = useDesktopStore(
    (state) => state.setWidgetApplication
  );
  const setWidgetTitle = useDesktopStore((state) => state.setWidgetTitle);

  const [activeFile, setActiveFile] = useState<Note | undefined>(
    defaultActiveFile
  );

  return (
    <Box className={toolbarCss}>
      <SaveButton
        activeFile={activeFile}
        onSave={(id, title) => {
          const savedFile = writeFile(id, title, content);
          setActiveFile(savedFile);
          setWidgetTitle(widget.id, title);
          setWidgetApplication(widget.id, {
            ...widget.application,
            params: { ...widget.application.params, activeFile: savedFile },
          } as TextEditorApplication);

          toast.success(`${savedFile.title} saved`, { autoClose: 2000 });
        }}
      />
      <OpenButton
        onDeleteFile={(note) => {
          deleteFile(note.id);
          if (note.id === activeFile?.id) {
            setActiveFile(undefined);
            setWidgetTitle(widget.id, "<unsaved>");
          }
          toast.success(`${note.title} deleted`, { autoClose: 2000 });
        }}
        onOpen={(note) => {
          setActiveFile(note);
          onContentChange(note.content);
          setWidgetTitle(widget.id, note.title);
        }}
      />
    </Box>
  );
}
