import { useEffect, useRef, useState } from "react";
import { BoxCol } from "../../components/Box";
import { useDesktopStore } from "../../state/desktopState";
import { ApplicationComponent } from "../../types/application";
import { Toolbar } from "./components/Toolbar";
import { editorCss } from "./styles";

const WIDGET_TITLE_UNSAVED = "<unsaved>";

export type Note = { id: string; title: string; content: string };

export const TextEditor: ApplicationComponent<"text-editor"> = ({
  params: { readonly, activeFile: defaultActiveFile },
  widget,
}) => {
  const setWidgetTitle = useDesktopStore((state) => state.setWidgetTitle);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(defaultActiveFile?.content ?? "");

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (!defaultActiveFile) {
      setWidgetTitle(widget.id, WIDGET_TITLE_UNSAVED);
    } else {
      setWidgetTitle(widget.id, defaultActiveFile.title);
    }
  }, [defaultActiveFile, setWidgetTitle, widget.id]);

  if (readonly) {
    return <div className={editorCss}>{content}</div>;
  }

  return (
    <BoxCol fillWidth className={editorCss}>
      <Toolbar
        widget={widget}
        defaultActiveFile={defaultActiveFile}
        content={content}
        onContentChange={setContent}
      />
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
