import { css } from "@emotion/css";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { PropsWithChildren } from "react";
import { Box } from "./components/Box";
import { ZIndex } from "./constants/constants";
import { PowerEnum, usePowerStore } from "./state/powerState";
import { getButtonBackgroundGradientStyles } from "./utils/style";

export function Viewport({ children }: PropsWithChildren) {
  const powerOn = usePowerStore((state) => state.powerOn);
  const powerState = usePowerStore((state) => state.powerState);

  const showOverlay =
    powerState === PowerEnum.Rebooting || powerState === PowerEnum.PoweringOff;
  const showDesktop =
    powerState !== PowerEnum.Off && powerState !== PowerEnum.PoweringOn;
  const isPoweringUp = powerState === PowerEnum.PoweringOn;

  return (
    <div className={viewportCss}>
      {showOverlay && <div className={powerLoadingCss} />}
      {showDesktop ? (
        children
      ) : (
        <Box fillHeight fillWidth alignItems="center" justifyContent="center">
          <button
            disabled={powerState === PowerEnum.PoweringOn}
            title="Power on"
            className={cx(buttonCss, { "powering-up": isPoweringUp })}
            onClick={powerOn}
          >
            <FontAwesomeIcon icon={faPowerOff} color="white" size="4x" />
          </button>
        </Box>
      )}
    </div>
  );
}

const viewportCss = css`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const { normal, pressed } = getButtonBackgroundGradientStyles("#444");
const buttonCss = css`
  --power-on-green: #99f100;
  --power-on-filter: blur(15px) brightness(1);
  --power-off-filter: blur(0px) brightness(0);

  padding: 24px;
  border-radius: 0.4rem;
  background: ${normal};

  border: 2px solid #222;
  box-shadow: 0 0 10px 0px #222 inset;
  border-radius: 50%;

  path {
    fill: var(--power-on-green);
    filter: var(--power-off-filter);
  }

  &:hover {
    opacity: 0.8;
  }

  &:active:not([disabled]) {
    background: ${pressed};
  }

  &.powering-up path {
    animation: poweringUp 1s ease-in;
    filter: var(--power-on-filter);
  }

  @keyframes poweringUp {
    0% {
      filter: var(--power-off-filter);
    }
    80% {
      filter: var(--power-on-filter);
    }
    81% {
      filter: var(--power-off-filter);
    }
    90% {
      filter: var(--power-on-filter);
    }
    91% {
      filter: var(--power-off-filter);
    }
    100% {
      filter: var(--power-on-filter);
    }
  }
`;

const powerLoadingCss = css`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.5;
  background: black;
  position: fixed;
  z-index: ${ZIndex.PowerOverlay};
`;
