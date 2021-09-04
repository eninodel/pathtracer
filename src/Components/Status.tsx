import React from "react";
import { useAppSelector } from "../ReduxHooks";

interface currentActions {
  action: "searching" | "finished" | "idle" | "hitWall";
  squaresSearched?: number;
}

function Status() {
  const action: currentActions["action"] = useAppSelector(
    (state) => state.getStatus.action
  );
  const squaresSerached: currentActions["squaresSearched"] = useAppSelector(
    (state) => state.getStatus.squaresSearched
  );

  const render = () => {
    if (action === "finished") {
      return <h1>Path found after searching {squaresSerached} square(s)!</h1>;
    } else if (action === "searching") {
      return (
        <div className="searching">
          <h1>searching</h1>
          <div className="dot-flashing"></div>
        </div>
      );
    } else if (action === "hitWall") {
      return (
        <h1>No path found after searching {squaresSerached} square(s)!</h1>
      );
    } else {
      // idle
      return (
        <div>
          <h1>Instructions</h1>
          <p>
            Click on any empty square to add a wall and click again to remove.
            Don't like the current board? Click "clear board" to get an empty
            board or "get random board" to get a different random board.
          </p>
        </div>
      );
    }
  };

  return <div className="status">{render()}</div>;
}

export default Status;
