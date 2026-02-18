import { toast } from "react-toastify";
import { Box } from "../../../components/Box";
import { useSetWidgetFilePath } from "../../../state/widgetState";
import { Widget } from "../../../types/widget";
import { getErrorMessage } from "../../../utils/error";
import { toolbarCss } from "../styles";
import { saveFile } from "../utils";
import { SaveButton } from "./toolbar-buttons/SaveButton";

interface Props {
  widget: Widget;
  content: string;
}

export function Toolbar({ widget, content }: Props) {
  const { id } = widget;
  const setWidgetFilePath = useSetWidgetFilePath();

  return (
    <Box className={toolbarCss}>
      <SaveButton
        widget={widget}
        onSave={async (path) => {
          try {
            await saveFile(`${path}`, content);
            setWidgetFilePath(id, path);
            toast.success(`${path} saved`, { autoClose: 2000 });
          } catch (e) {
            toast.error(`Failed to save file: ${getErrorMessage(e)}`);
          }
        }}
      />
    </Box>
  );
}
