import { css } from "@emotion/css";
import { Box, BoxCol } from "../../components/Box";

const blueScreenCss = css`
  background: rgba(0, 102, 255, 0.78);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding: 2rem;

  button {
    background: inherit;
    border: none;
    font-size: inherit;
    border-radius: 0.2rem;
    color: rgb(11, 178, 255);

    transition: background 100ms ease-in-out;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    &:active {
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export function BSOD({ error }: { error?: string }) {
  return (
    <Box className={blueScreenCss}>
      <BoxCol gap={"4rem"}>
        <div>
          <div style={{ fontSize: "4em" }}>
            {"System has encountered an error. :("}
          </div>
          <div style={{ fontSize: "2rem" }}>
            {error && (
              <>
                Message:{" "}
                <span style={{ fontFamily: "monospace" }}>{error}</span>
              </>
            )}
          </div>
        </div>
        <div style={{ fontSize: "2rem" }}>
          Try
          <button onClick={() => window.location.reload()}>reloading</button>
          the page, or
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            clearing your storage
          </button>
          to remove any stale settings.
        </div>
      </BoxCol>
    </Box>
  );
}
