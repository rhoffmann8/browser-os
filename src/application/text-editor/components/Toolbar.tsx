import { useState } from "react";
import { toast } from "react-toastify";
import { Box } from "../../../components/Box";
import { ChangeHandler, Widget } from "../../../types";
import { TextEditorApplication } from "../../../types/application";
import { toolbarCss } from "../styles";
import { Note } from "../TextEditor";
import { deleteFile, writeFile } from "../utils";
import { OpenButton } from "./toolbar-buttons/OpenButton";
import { SaveButton } from "./toolbar-buttons/SaveButton";

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
          widget.setTitle(title);
          widget.setApplication({
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
            widget.setTitle("<unsaved>");
          }
          toast.success(`${note.title} deleted`, { autoClose: 2000 });
        }}
        onOpen={(note) => {
          setActiveFile(note);
          onContentChange(note.content);
          widget.setTitle(note.title);
        }}
      />
    </Box>
  );
}
