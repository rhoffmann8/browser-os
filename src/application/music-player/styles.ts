import { css } from "@emotion/css";
import { getButtonBackgroundGradientStyles } from "../../utils/style";

export const getButtonCss = (color1: string, color2?: string) => {
  const { normal, pressed } = getButtonBackgroundGradientStyles(color1, color2);

  return css`
    background: ${normal};

    transition: opacity 100ms ease-in-out;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      background: ${pressed};
    }
  `;
};

export const controlsContainerCss = css`
  button {
    height: 2rem;
    width: 2rem;
    border: none;

    ${getButtonCss(
      "var(--color-theme-primary)",
      "var(--color-theme-secondary)"
    )}
  }
`;
