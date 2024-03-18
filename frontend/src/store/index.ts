import { configureStore } from '@reduxjs/toolkit';
import { themeSlice } from './slices/theme';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { catSlice } from './slices/cats';
import { authSlice } from './slices/auth';

const store = configureStore({
  reducer: { theme: themeSlice.reducer, cats: catSlice.reducer, auth: authSlice.reducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();