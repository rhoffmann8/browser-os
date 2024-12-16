import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

export function Board({ size, onWin }: { size: number; onWin: () => void }) {
  // These states save the indices of the tiles, not the numbers
  const [matches, setMatches] = useState<Set<number>>(new Set());
  const [turned, setTurned] = useState<Set<number>>(new Set());

  const tiles = useMemo(() => createTiles(size), [size]);

  const updateMatched = useCallback(() => {
    const [card1, card2] = Array.from(turned);
    if (tiles[card1] === tiles[card2]) {
      setMatches((prev) => new Set([...Array.from(prev), card1, card2]));
    }
  }, [tiles, turned]);

  const handleClick = useCallback(
    (tileIndex: number) => {
      if (turned.size > 1) return;
      setTurned((prev) => new Set(prev.add(tileIndex)));
    },
    [turned]
  );

  useEffect(() => {
    if (turned.size < 2) return;

    const timeout = setTimeout(() => {
      updateMatched();
      setTurned(new Set());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [turned, updateMatched]);

  useEffect(() => {
    if (matches.size === size ** 2) {
      onWin();
    }
  }, [matches, onWin, size]);

  return (
    <div className="board" style={{ "--board-size": size }}>
      {tiles.map((tile, idx) =>
        matches.has(idx) ? (
          <div key={idx} />
        ) : (
          <Fragment key={idx}>
            <button className="tile" onClick={() => handleClick(idx)}>
              <div className={`tile-inner ${turned.has(idx) ? "show" : ""}`}>
                <div className="tile-front" />
                <div className="tile-back">{tile}</div>
              </div>
            </button>
          </Fragment>
        )
      )}
    </div>
  );
}

function shuffle(arr: number[]) {
  return arr.slice().sort(() => (Math.random() > 0.5 ? -1 : 1));
}

function createTiles(size: number) {
  const numTiles = size ** 2;
  const numbers = Array.from({ length: numTiles / 2 }).map((_, idx) => idx + 1);
  return shuffle(numbers.concat(numbers));
}
