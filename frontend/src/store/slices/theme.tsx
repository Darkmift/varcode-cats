// a redux toolkit store slice with darkMode boolean
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
