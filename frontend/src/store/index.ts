import { configureStore } from '@reduxjs/toolkit';
import { themeSlice } from './slices/theme';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { catSlice } from './slices/cats.slice';
import { authSlice } from './slices/auth.slice';
import { authAPI } from './http/api/auth';
import { catsApi } from './http/api/cats';
// import { snackbarSlice } from './slices/snackbar.slice';

const store = configureStore({
  reducer: {
    // Your reducers
    theme: themeSlice.reducer,
    cats: catSlice.reducer,
    auth: authSlice.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [catsApi.reducerPath]: catsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authAPI.middleware).concat(catsApi.middleware), // Add catsApi.middleware here
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
