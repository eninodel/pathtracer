import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface SquareStates {
  squares: {
    [key: string]: string;
  };
}

const initialState: SquareStates = {
  squares: { "00": "start", "99": "finish" },
};

export const squareSlice = createSlice({
  name: "squares",
  initialState,
  reducers: {
    addSquares: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.squares = { ...state.squares, ...action.payload };
    },
  },
});

export const { addSquares } = squareSlice.actions;

export const getSquares = (state: RootState) => state.getSquares;

export default squareSlice.reducer;
// type state = {
//   squares: {
//     [key: string]: string;
//   };
// };

// type action = {
//   type: string;
//   payload: {
//     [key: string]: string;
//   };
// };

// export const SquareReducer = (state: state, action: action) => {
//   switch (action.type) {
//     case "ADD_SQUARES":
//       const newState: state = {
//         squares: { ...state.squares, ...action.payload },
//       };
//       return newState;
//     case "UPDATE_SQUARE":
//       const updatedSquare: action["payload"] = action.payload;
//       return { squares: { ...state.squares, ...updatedSquare } };
//   }
// };
