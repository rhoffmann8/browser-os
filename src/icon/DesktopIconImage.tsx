import { css } from "@emotion/css";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DesktopIcon } from "../types";
import cx from "classnames";
import { Application } from "../types/application";

const imageCss = css`
  -webkit-filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.7));
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.7));
`;

export function DesktopIconImage<A extends Application>({
  icon,
}: {
  icon: DesktopIcon<A>;
}) {
  return (
    <FontAwesomeIcon
      className={cx(imageCss, icon.iconClassName)}
      icon={icon.icon ?? faCircle}
      size="3x"
    />
  );
}
