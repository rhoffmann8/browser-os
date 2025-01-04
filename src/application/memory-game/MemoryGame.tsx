import { css } from "@emotion/css";
import { useCallback, useState } from "react";
import { Box, BoxCol } from "../../components/Box";
import { ApplicationComponent } from "../../types/application";
import { Board } from "./Board";

import "./styles.css";

enum Screen {
  START,
  BOARD,
  WIN,
}

const gameContainerCss = css`
  min-width: 400px;
  min-height: 420px;
  padding: 24px;
`;

export const MemoryGame: ApplicationComponent = () => {
  const [screen, setScreen] = useState(Screen.START);
  const [moveCount, setMoveCount] = useState(0);

  const onStart = useCallback(() => {
    setMoveCount(0);
    setScreen(Screen.BOARD);
  }, []);

  const renderScreen = useCallback(() => {
    if (screen === Screen.START) {
      return <ChooseBoard onStart={onStart} />;
    } else if (screen === Screen.BOARD) {
      return (
        <BoxCol gap={4} alignItems="center">
          <Board
            size={4}
            onMoveCountUpdate={setMoveCount}
            onWin={() => setScreen(Screen.WIN)}
          />
          <div>Moves: {moveCount}</div>
        </BoxCol>
      );
    } else if (screen === Screen.WIN) {
      return <Win moveCount={moveCount} onReset={onStart} />;
    }

    return null;
  }, [moveCount, onStart, screen]);

  return (
    <Box
      className={gameContainerCss}
      flexDirection="column"
      alignItems="center"
      flex={1}
    >
      {renderScreen()}
    </Box>
  );
};

function Win({
  onReset,
  moveCount,
}: {
  moveCount: number;
  onReset: () => void;
}) {
  return (
    <div className="win">
      <h1>You win</h1>
      <h2>Moves: {moveCount}</h2>
      <button className="button" onClick={onReset}>
        Replay
      </button>
    </div>
  );
}

function ChooseBoard({ onStart }: { onStart: () => void }) {
  return (
    <Box fillHeight fillWidth alignItems="center" justifyContent="center">
      <button className="button" onClick={onStart}>
        Start game
      </button>
    </Box>
  );
}
