import { css } from "@emotion/css";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { PropsWithChildren } from "react";
import { Box } from "./components/Box";
import { ZIndex } from "./constants";
import { PowerEnum, usePowerStore } from "./state/powerState";
import { getButtonBackgroundGradientStyles } from "./utils/style";

const viewportCss = css`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const { normal, pressed } = getButtonBackgroundGradientStyles("#444");
const buttonCss = css`
  --power-on-green: #3acc00;
  --power-off-gray: #aaa;
  --power-on-filter: blur(20px) saturate(5);
  --power-off-filter: blur(0px) saturate(0);

  padding: 24px;
  border-radius: 0.4rem;
  background: ${normal};

  border: 2px solid #222;
  box-shadow: 0 0 10px 0px #222 inset;
  border-radius: 50%;

  path {
    fill: #aaa;
  }

  &:active {
    background: ${pressed};
  }

  &.powering-up path {
    animation: poweringUp 1s ease-in;
    fill: var(--power-on-green);
    filter: var(--power-on-filter);
  }

  @keyframes poweringUp {
    0% {
      fill: var(--power-off-gray);
      filter: var(--power-off-filter);
    }
    90% {
      fill: var(--power-on-green);
      filter: var(--power-on-filter);
    }
    91% {
      fill: var(--power-off-gray);
      filter: var(--power-off-filter);
    }
    100% {
      fill: var(--power-on-green);
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
