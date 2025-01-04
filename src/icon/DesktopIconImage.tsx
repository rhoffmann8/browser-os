import { css } from "@emotion/css";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { DesktopIcon } from "../types/widget";

const imageCss = css`
  -webkit-filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.7));
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.7));
`;

export function DesktopIconImage({ icon }: { icon: DesktopIcon }) {
  return (
    <FontAwesomeIcon
      className={cx(imageCss, icon.iconClassName)}
      icon={icon.icon ?? faCircle}
      size="3x"
    />
  );
}
