import React, { ReactElement, useState, useRef } from "react";
import Square from "./Components/Square";
import { useAppDispatch } from "./hooks";
import { addSquares } from "./SquareReducer";
import "./index.scss";

const initArr = ["", "", "", "", "", "", "", "", "", ""];
const wallThreshold: number = 0.7;

function App() {
  const board: React.MutableRefObject<
    ("wall" | "empty" | "start" | "finish" | "active")[][]
  > = useRef(
    Array(10)
      .fill([])
      .map((_) => {
        return initArr.map((item: string) => {
          if (Math.random() > wallThreshold) {
            return "wall";
          } else {
            return "empty";
          }
        });
      })
  );
  const dispatch = useAppDispatch();
  const isRunning = useRef(false);

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

  const search = (diagonals: boolean) => {
    const boardCopy: Array<Array<string>> = board.current.map(
      // gets copy of board to use
      (row: string[]) => {
        return row.map((square: string) => {
          return square;
        });
      }
    );
    const visited: Set<string> = new Set();
    const stack: string[] = [];
    let finished: boolean = false;
    stack.push("00");

    let interval: any = setInterval(() => {
      let curr: string = String(stack.pop());
      while (visited.has(curr)) {
        curr = String(stack.pop());
      }
      if (finished || curr === undefined) {
        // either finished or no path found
        if (finished) dispatch(addSquares({ "99": "finish" }));
        isRunning.current = false;
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
          isRunning.current = false;
          finished = true;
          return;
        } else {
          // found empty block or start
          for (let i = ith - 1; i <= ith + 1; i++) {
            for (let j = jth - 1; j <= jth + 1; j++) {
              if (
                i >= 0 && // checks for bounds
                j >= 0 &&
                i <= board.current.length - 1 &&
                j <= board.current.length - 1 &&
                boardCopy[i][j] !== "wall"
              ) {
                if (!diagonals && Math.abs(i + j - (ith + jth)) === 1) {
                  stack.push(i + "" + j);
                } else if (diagonals) {
                  stack.push(i + "" + j);
                }
              }
            }
          }
        }
        dispatch(addSquares({ [curr]: "searched" })); // turn active block back to original state
      }, 500);
    }, 1000);
  };

  const handleSearchClick = (diagonals: boolean) => {
    if (isRunning.current) return;
    isRunning.current = true;
    search(diagonals);
  };

  const handleBoardChangeClick = (reset: boolean) => {
    if (isRunning.current) return;
    board.current = board.current.map((row: string[], i: number) => {
      return row.map((individualSquare: string, j: number) => {
        const squareKey: string = i + "" + j;
        if (squareKey === "00") {
          dispatch(addSquares({ [squareKey]: "start" }));
          return "start";
        } else if (squareKey === "99") {
          dispatch(addSquares({ [squareKey]: "finish" }));
          return "finish";
        }
        if (reset) {
          dispatch(addSquares({ [squareKey]: "empty" }));
          return "empty";
        } else {
          if (Math.random() > wallThreshold) {
            dispatch(addSquares({ [squareKey]: "wall" }));
            return "wall";
          } else {
            dispatch(addSquares({ [squareKey]: "empty" }));
            return "empty";
          }
        }
      });
    });
  };

  return (
    <div className="App">
      <div className="grid">{renderBoard()}</div>
      <div className="buttton-container">
        <button type="button" onClick={() => handleSearchClick(true)}>
          Click to search (diagonals included)!
        </button>
        <button type="button" onClick={() => handleSearchClick(false)}>
          Click to search (diagonals excluded)!
        </button>
        <button type="button" onClick={() => handleBoardChangeClick(false)}>
          Get random board
        </button>
        <button type="button" onClick={() => handleBoardChangeClick(true)}>
          Clear board
        </button>
      </div>
    </div>
  );
}

export default App;
