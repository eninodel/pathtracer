import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./ReduxStore";

interface SquareStates {
  squares: {
    [key: string]: string;
  };
  clickable: boolean;
}

const initialState: SquareStates = {
  squares: { "00": "start", "99": "finish" },
  clickable: true,
};

export const squareSlice = createSlice({
  name: "squares",
  initialState,
  reducers: {
    addSquares: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.squares = { ...state.squares, ...action.payload };
    },
    updateSquareClick: (state, action: PayloadAction<boolean>) => {
      state.clickable = action.payload;
    },
  },
});

export const { addSquares, updateSquareClick } = squareSlice.actions;

export const getSquares = (state: RootState) => state.getSquares;

export default squareSlice.reducer;
