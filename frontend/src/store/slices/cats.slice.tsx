// a redux toolkit store slice with darkMode boolean
import { ICat, IPaginationResult } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

export interface CatThemeState {
  catNameSearchTerm: string;
  currentCats: ICat[];
  pagination: IPaginationResult<ICat>;
}

const initialState: CatThemeState = {
  catNameSearchTerm: '',
  currentCats: [],
  pagination: {
    items: [],
    hasNext: false,
    hasPrev: false,
    total: 0,
  },
};

export const catSlice = createSlice({
  name: 'cats',
  initialState,
  reducers: {
    // a setter for catNameSearchTerm
    setSearchTerm: (state, action) => {
      state.catNameSearchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = catSlice.actions;
