import React, { ReactElement } from "react";
import Square from "./Square";
import type { squareTypes } from "../App";

function Grid({ board }: { board: React.MutableRefObject<squareTypes[][]> }) {
  const renderBoard = () => {
    let renderedBoard: Array<ReactElement> = [];
    board.current.map((row: string[], i: number) => {
      return row.map((individualSquare: string, j: number) => {
        const newSquare = (
          <Square
            squareType={individualSquare}
            ith={i}
            jth={j}
            key={Math.random()}
            board={board}
          ></Square>
        );
        return renderedBoard.push(newSquare);
      });
    });
    return renderedBoard;
  };
  return <div className="grid">{renderBoard()}</div>;
}

export default Grid;
