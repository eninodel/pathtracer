import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./ReduxStore";

interface StatusStates {
  action: "searching" | "finished" | "idle" | "hitWall";
  squaresSearched?: number;
}

const initialState: StatusStates = {
  action: "idle",
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<StatusStates["action"]>) => {
      state.action = action.payload;
    },
    updateSquaresSearched: (state, action: PayloadAction<number>) => {
      state.squaresSearched = action.payload;
    },
  },
});

export const { updateStatus, updateSquaresSearched } = statusSlice.actions;

export const getStatus = (state: RootState) => state.getStatus;

export default statusSlice.reducer;
