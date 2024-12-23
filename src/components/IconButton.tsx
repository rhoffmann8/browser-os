import { css } from "@emotion/css";
import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { ButtonHTMLAttributes } from "react";
import { getButtonBackgroundGradientStyles } from "../utils/style";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconDefinition;
  iconProps?: Omit<FontAwesomeIconProps, "icon">;
}

export function IconButton({
  icon,
  iconProps,
  className,
  ...buttonProps
}: Props) {
  return (
    <button className={cx(buttonCss, className)} {...buttonProps}>
      <FontAwesomeIcon icon={icon} {...iconProps} />
    </button>
  );
}

const { normal, pressed } = getButtonBackgroundGradientStyles(
  "var(--color-theme-hover)"
);

const buttonCss = css`
  background: ${normal};
  box-shadow: 0px 1px 2px 0px var(--color-theme-secondary);

  transition: opacity 100ms ease-in-out;

  &[disabled] {
    cursor: inherit;
  }

  &:hover:not([disabled]) {
    opacity: 0.75;
  }

  &:active:not([disabled]) {
    background: ${pressed};
  }
`;
