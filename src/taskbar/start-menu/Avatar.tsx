import { css } from "@emotion/css";
import { Box } from "../../components/Box";

export function Avatar() {
  return (
    <Box fillWidth alignItems="center" justifyContent="center">
      <div className={avatarCss} title="it me">
        <b>R</b>
        <b>H</b>
      </div>
    </Box>
  );
}

const avatarCss = css`
  font-size: 1.6rem;
  text-shadow: 0px 2px 1px black;

  position: relative;
  user-select: none;

  &:hover {
    opacity: 0.75;
  }

  b {
    position: absolute;
    left: 50%;
    top: 8px;
  }

  b:first-child {
    transform: translate(-85%, -15%);
  }
  b:last-child {
    transform: translate(-15%, 15%);
  }
`;
