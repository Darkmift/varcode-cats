import { configureStore } from '@reduxjs/toolkit';
import { themeSlice } from './slices/theme';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { catSlice } from './slices/cats.slice';
import { authSlice } from './slices/auth.slice';
import { authAPI } from './http/api/auth';
// import { snackbarSlice } from './slices/snackbar.slice';

const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    cats: catSlice.reducer,
    auth: authSlice.reducer,
    // snackbar: snackbarSlice.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authAPI.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
