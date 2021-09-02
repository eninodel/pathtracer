import React, { ReactElement, useState, useEffect, useRef } from "react";
import Square from "./Components/Square";
import { useAppDispatch } from "./hooks";
import { addSquares } from "./SquareReducer";
import "./index.scss";

function App() {
  const board = useRef(Array(10).fill(Array(10).fill("empty")));
  const dispatch = useAppDispatch();

  const [isRunning, setIsRunning] = useState(false);

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

  const search = () => {
    const boardCopy: Array<Array<string>> = board.current.map(
      // gets copy of board to use
      (row: string[]) => {
        return row.map((square: string) => {
          return square;
        });
      }
    );
    const visited: Set<string> = new Set();
    const queue: string[] = [];
    let finished: boolean = false;
    queue.push("00");

    let interval: any = setInterval(() => {
      let curr: string = String(queue.shift());
      while (visited.has(curr)) {
        curr = String(queue.shift());
      }
      if (finished || curr === undefined) {
        // either finished or no path found
        if (finished) dispatch(addSquares({ "99": "finish" }));
        clearInterval(interval);
        return;
      }
      visited.add(curr);
      dispatch(addSquares({ [curr]: "active" }));

      setTimeout(() => {
        // wait a bit so user can see activate animation
        const ith: number = parseInt(curr.charAt(0));
        const jth: number = parseInt(curr.charAt(1));

        if (isNaN(ith) || isNaN(jth)) {
          // no path found
          clearInterval(interval);
          return;
        }

        const squareType: string = boardCopy[ith][jth];
        if (squareType === "wall") {
          // found a wall
          dispatch(addSquares({ [curr]: "wall" })); // set active back to wall
        } else if (squareType === "finish") {
          // finished and found path!
          finished = true;
          return;
        } else {
          // found empty block or start
          for (let i = ith; i <= ith + 1; i++) {
            for (let j = jth; j <= jth + 1; j++) {
              if (
                i >= 0 && // checks for bounds
                j >= 0 &&
                i <= board.current.length - 1 &&
                j <= board.current.length - 1
              ) {
                queue.push(i + "" + j);
              }
            }
          }
        }
        dispatch(addSquares({ [curr]: squareType })); // turn active block back to original state
      }, 500);
    }, 1000);
  };

  return (
    <div className="App">
      <div className="grid">{renderBoard()}</div>
      <button type="button" onClick={() => search()}>
        Click to search!
      </button>
    </div>
  );
}

export default App;
