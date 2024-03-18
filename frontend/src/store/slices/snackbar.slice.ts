// src/redux/snackbarSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

// Define the initial state for the snackbar slice
export interface SnackbarState {
  snackbars: { id: string; message: string }[];
}

const initialState: SnackbarState = {
  snackbars: [],
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    triggerSnackbar: (state, action) => {
      // Add a new snackbar with a unique ID and the provided message
      state.snackbars.push({
        id: nanoid(),
        message: action.payload,
      });
    },
    removeSnackbar: (state, action) => {
      // Remove the snackbar with the specified ID
      state.snackbars = state.snackbars.filter((snackbar) => snackbar.id !== action.payload);
    },
  },
});

export const { triggerSnackbar, removeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
