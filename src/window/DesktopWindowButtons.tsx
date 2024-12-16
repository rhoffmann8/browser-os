import { css } from "@emotion/css";
import { useDesktopStore } from "../state/desktopState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { UniqueIdentifier } from "@dnd-kit/core";

const buttonCss = css`
  color: white;
  border: none;
  padding: 4px 16px;
  height: 100%;

  transition: background 100ms ease-in-out;
  background: transparent;

  &:hover {
    background: #da4949;
  }
`;

export function DesktopWindowButtons({ id }: { id: UniqueIdentifier }) {
  const closeWindow = useDesktopStore((state) => state.closeWindow);

  return (
    <div>
      <button className={buttonCss} onClick={() => closeWindow(id)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
