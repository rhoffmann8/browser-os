import { useCallback, useState } from "react";
import { ApplicationComponent } from "../../types/application";

import "./styles.css";
import { Board } from "./Board";
import { Box } from "../../components/Box";

enum Screen {
  START,
  BOARD,
  WIN,
}

export const MemoryGame: ApplicationComponent<"memory-game"> = () => {
  const [screen, setScreen] = useState(Screen.START);

  const renderScreen = useCallback(() => {
    if (screen === Screen.START) {
      return <ChooseBoard onStart={() => setScreen(Screen.BOARD)} />;
    } else if (screen === Screen.BOARD) {
      return <Board size={4} onWin={() => setScreen(Screen.WIN)} />;
    } else if (screen === Screen.WIN) {
      return <Win onReset={() => setScreen(Screen.BOARD)} />;
    }

    return null;
  }, [screen]);

  return (
    <Box flexDirection="column" alignItems="center" flex={1}>
      <h1>Memory game</h1>
      {renderScreen()}
    </Box>
  );
};

function Win({ onReset }: { onReset: () => void }) {
  return (
    <div className="win">
      <h1>You win</h1>
      <button className="button" onClick={onReset}>
        Replay
      </button>
    </div>
  );
}

function ChooseBoard({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <button className="button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
