import { css } from "@emotion/css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export function WidgetButtons({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <button className={buttonCss} onClick={onClose}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
