import { css } from "@emotion/css";
import { Box } from "../../components/Box";
import { ApplicationComponent } from "../../types/application";
import { useWidgetStore } from "../../state/widgetState";

const dialogCss = css`
  padding: 4px 12px 12px 12px;
  font-size: 14px;

  button {
    background: #aaa;
    padding: 4px 16px;
    border: none;

    &:hover {
      background: var(--color-theme-hover);
    }
  }
`;

export const Dialog: ApplicationComponent = ({ widget }) => {
  const {
    params: { message },
  } = widget;

  const close = useWidgetStore((state) => state.closeWidget);

  return (
    <Box
      className={dialogCss}
      flexDirection="column"
      flex={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Box padding={"0 8px 4px 8px"}>{message}</Box>
      <button onClick={() => close(widget.id)}>OK</button>
    </Box>
  );
};
