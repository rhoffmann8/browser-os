import { css } from "@emotion/css";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DesktopIcon } from "../types";
import cx from "classnames";

const imageCss = css`
  flex: 1;
  max-height: 48px;
`;

export function DesktopIconImage({ icon }: { icon: DesktopIcon }) {
  return (
    <FontAwesomeIcon
      className={cx(imageCss, icon.iconClassName)}
      icon={icon.icon ?? faCircle}
    />
  );
}
