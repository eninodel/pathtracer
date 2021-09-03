import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { addSquares } from "../SquareReducer";

type SquareProps = {
  squareType: string;
  ith: number;
  jth: number;
  board: any;
};

function Square({ squareType, ith, jth, board }: SquareProps) {
  const squares: { [key: string]: string } = useAppSelector(
    (state) => state.getSquares.squares
  );
  const dispatch = useAppDispatch();
  const squareKey: string = ith + "" + jth;
  const [typeOfSquare, setTypeOfSquare] = useState("");

  const updateBoard = (newSquare: string) => {
    board.current = board.current.map((row: string[], i: number) => {
      return row.map((square: string, j: number) => {
        if (i === ith && j === jth) {
          return newSquare;
        } else {
          return square;
        }
      });
    });
  };

  useEffect(() => {
    if (squareKey in squares) {
      setTypeOfSquare(squares[squareKey]);
      updateBoard(squares[squareKey]);
    } else {
      setTypeOfSquare(squareType);
      updateBoard(squareType);
    }
  }, [squares]);

  const handleClick = () => {
    if (typeOfSquare === "finish" || typeOfSquare === "start") return;
    if (typeOfSquare !== "wall") {
      dispatch(addSquares({ [squareKey]: "wall" }));
      updateBoard("wall");
    } else {
      dispatch(addSquares({ [squareKey]: "empty" }));
      updateBoard("empty");
    }
  };

  return (
    <div
      className={"square " + typeOfSquare}
      onClick={() => {
        handleClick();
      }}
    ></div>
  );
}

export default Square;
