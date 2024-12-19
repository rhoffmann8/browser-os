import { faRotateLeft, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BoxCol } from "../../components/Box";
import { css } from "@emotion/css";
import { getButtonBackgroundGradientStyles } from "../../utils/style";
import { usePowerStore } from "../../state/powerState";

export function PowerButtons() {
  const powerOff = usePowerStore((state) => state.powerOff);
  const reboot = usePowerStore((state) => state.reboot);

  return (
    <BoxCol className={powerButtonsCss} gap={4}>
      <button title="Restart" onClick={reboot}>
        <FontAwesomeIcon icon={faRotateLeft} size="1x" />
      </button>
      <button title="Power off" onClick={powerOff}>
        <FontAwesomeIcon icon={faPowerOff} size="1x" />
      </button>
    </BoxCol>
  );
}

const reloadButtonGradients = getButtonBackgroundGradientStyles(
  "#c99300",
  "color-mix(in srgb, #c99300 70%, transparent)"
);
const powerButtonGradients = getButtonBackgroundGradientStyles(
  "var(--color-theme-red)",
  "color-mix(in srgb, var(--color-theme-red) 70%, transparent)"
);

const powerButtonsCss = css`
  button {
    padding: 6px 8px;
    border-radius: 0.4rem;
    box-shadow: 0 1px 1px 1px black;

    &:hover {
      opacity: 0.75;
    }
  }

  button:first-child {
    background: ${reloadButtonGradients.normal};

    &:active {
      background: ${reloadButtonGradients.pressed};
    }
  }

  button:last-child {
    background: ${powerButtonGradients.normal};

    &:active {
      background: ${powerButtonGradients.pressed};
    }
  }
`;
