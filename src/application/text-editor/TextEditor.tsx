import { useEffect, useRef, useState } from "react";
import { BoxCol } from "../../components/Box";
import { useAutosizeOnLoad } from "../../hooks/useAutosizeOnLoad";
import { useWidgetStore } from "../../state/widgetState";
import { ApplicationComponent } from "../../types/application";
import { Toolbar } from "./components/Toolbar";
import { editorCss } from "./styles";
import { getFile } from "./utils";

const WIDGET_TITLE_UNSAVED = "<unsaved>";

export type Note = { id: string; title: string; content: string };

export const TextEditor: ApplicationComponent = ({ widget }) => {
  const { id, filePath } = widget;

  const setWidgetTitle = useWidgetStore((state) => state.setWidgetTitle);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState<string>("");

  useAutosizeOnLoad(widget, { width: 500, height: 300 });

  useEffect(() => {
    if (!filePath) {
      setWidgetTitle(id, WIDGET_TITLE_UNSAVED);
      return;
    }
    setWidgetTitle(id, filePath.split("/").at(-1) ?? undefined);
    getFile(filePath).then((content) => {
      if (content) setContent(content);
    });
  }, [filePath, id, setWidgetTitle]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  return (
    <BoxCol fillWidth className={editorCss}>
      <Toolbar widget={widget} content={content} />
      <textarea
        ref={inputRef}
        placeholder="Your text goes here"
        value={content}
        className={editorCss}
        onChange={(e) => setContent(e.currentTarget.value)}
      />
    </BoxCol>
  );
};
