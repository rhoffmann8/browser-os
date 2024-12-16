import { css } from "@emotion/css";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "../types";

const imageCss = css`
  flex: 1;
  max-height: 48px;
`;

export function DesktopIconImage({ icon }: { icon: Icon }) {
  return <FontAwesomeIcon className={imageCss} icon={icon.icon ?? faCircle} />;
}
