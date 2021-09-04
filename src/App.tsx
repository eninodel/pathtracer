import React, { useRef } from "react";
import Grid from "./Components/Grid";
import Status from "./Components/Status";
import { useAppDispatch } from "./ReduxHooks";
import { addSquares, updateSquareClick } from "./SquareReducer";
import { updateStatus, updateSquaresSearched } from "./StatusReducer";
import "./index.scss";

const initArr = ["", "", "", "", "", "", "", "", "", ""];
export type squareTypes =
  | "wall"
  | "empty"
  | "start"
  | "finish"
  | "active"
  | "visited";
const wallThreshold: number = 0.7;

function App() {
  const board: React.MutableRefObject<squareTypes[][]> = useRef(
    Array(10)
      .fill([])
      .map((_) => {
        return initArr.map((_) => {
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
  const isFirstTime = useRef(false);

  interface CopyBoardParameters {
    matrix: Array<Array<squareTypes>>;
    operation: "copy" | "reset" | "clearboard" | "random";
  }

  const copyBoard = ({ matrix, operation }: CopyBoardParameters) => {
    return matrix.map((row: squareTypes[], i: number) => {
      return row.map((square: squareTypes, j: number) => {
        const squareKey: string = i + "" + j;
        if (operation !== "copy") {
          if (squareKey === "00") {
            dispatch(addSquares({ [squareKey]: "start" }));
            return "start";
          } else if (squareKey === "99") {
            dispatch(addSquares({ [squareKey]: "finish" }));
            return "finish";
          }
          if (operation === "clearboard") {
            dispatch(addSquares({ [squareKey]: "empty" }));
            return "empty";
          } else if (operation === "reset") {
            //reset board
            if (String(square) === "searched") {
              dispatch(addSquares({ [squareKey]: "empty" }));
              return "empty";
            } else {
              dispatch(addSquares({ [squareKey]: square }));
              return square;
            }
          } else {
            // random
            if (Math.random() > wallThreshold) {
              dispatch(addSquares({ [squareKey]: "wall" }));
              return "wall";
            } else {
              dispatch(addSquares({ [squareKey]: "empty" }));
              return "empty";
            }
          }
        } else {
          // copies board
          return square;
        }
      });
    });
  };

  const search = (diagonals: boolean, DFS: boolean) => {
    let boardCopy: Array<Array<string>>;
    if (!isFirstTime.current) {
      boardCopy = copyBoard({ matrix: board.current, operation: "reset" });
    } else {
      boardCopy = copyBoard({ matrix: board.current, operation: "copy" });
      isFirstTime.current = true;
    }
    const visited: Set<string> = new Set();
    const coordinates: string[] = [];
    coordinates.push("00");

    let interval: any = setInterval(() => {
      let curr: string;
      if (DFS) {
        curr = String(coordinates.pop());
      } else {
        curr = String(coordinates.shift());
      }

      while (visited.has(curr)) {
        if (DFS) {
          curr = String(coordinates.pop());
        } else {
          curr = String(coordinates.shift());
        }
      }

      visited.add(curr);
      dispatch(addSquares({ [curr]: "active" }));

      setTimeout(() => {
        // wait a bit so user can see activate animation
        const ith: number = parseInt(curr.charAt(0));
        const jth: number = parseInt(curr.charAt(1));

        if (isNaN(ith) || isNaN(jth)) {
          // no path found
          onFinish(interval, visited.size - 1, false);
          return;
        }

        const squareType: string = boardCopy[ith][jth];

        if (squareType === "wall") {
          // found a wall
          dispatch(addSquares({ [curr]: "wall" })); // set activeSall
        } else if (squareType === "finish") {
          // finished and found path!
          onFinish(interval, visited.size, true);
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
                  coordinates.push(i + "" + j);
                } else if (diagonals) {
                  coordinates.push(i + "" + j);
                }
              }
            }
          }
        }
        dispatch(addSquares({ [curr]: "searched" })); // turn active block to searched state
      }, 125);
    }, 250);
  };

  const onFinish = (
    interval: NodeJS.Timeout,
    squaresSearched: number,
    finished: boolean
  ) => {
    // executes when search is finished
    if (finished) {
      dispatch(updateStatus("finished"));
      dispatch(addSquares({ "99": "searched" }));
    } else {
      dispatch(updateStatus("hitWall"));
    }
    dispatch(updateSquaresSearched(squaresSearched));
    dispatch(updateSquareClick(true));
    clearInterval(interval);
    isRunning.current = false;
  };

  const handleSearchClick = (diagonals: boolean, DFS: boolean) => {
    dispatch(updateStatus("searching"));
    dispatch(updateSquareClick(false));
    if (isRunning.current) return;
    search(diagonals, DFS);
    isRunning.current = true;
  };

  return (
    <div className="App">
      <div className="grid-and-buttons">
        <Grid board={board} />
        <div className="button-groups">
          <div className="button-container">
            <button type="button" onClick={() => handleSearchClick(true, true)}>
              Search via DFS(diagonals included)!
            </button>
            <button
              type="button"
              onClick={() => handleSearchClick(false, true)}
            >
              Search via DFS (diagonals excluded)!
            </button>

            <button
              type="button"
              onClick={() => handleSearchClick(true, false)}
            >
              Search via BFS(diagonals included)!
            </button>
            <button
              type="button"
              onClick={() => handleSearchClick(false, false)}
            >
              Search via BFS (diagonals excluded)!
            </button>
          </div>
          <div className="button-container">
            <button
              type="button"
              onClick={() => {
                dispatch(updateStatus("idle"));
                board.current = copyBoard({
                  matrix: board.current,
                  operation: "random",
                });
              }}
            >
              Get random board
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(updateStatus("idle"));
                board.current = copyBoard({
                  matrix: board.current,
                  operation: "clearboard",
                });
              }}
            >
              Clear board
            </button>
          </div>
        </div>
        <Status />
      </div>
    </div>
  );
}

export default App;
