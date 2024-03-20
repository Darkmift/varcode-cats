import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../http/api/auth';
import { ILoginResult, Role } from '@/types';

export interface IAuthState {
  username: string;
  role: Role;
  firstName: string;
  lastName: string;
  token: string;
  loading: boolean;
  error: SerializedError | string | null;
  cat_type_id: string;
}

const initialState: IAuthState = {
  username: '',
  role: Role.USER,
  firstName: '',
  lastName: '',
  token: '',
  loading: false,
  error: '',
  cat_type_id: '',
};

const _updateUserState = (state: IAuthState, action: PayloadAction<ILoginResult>) => {
  const { username, role, firstname, lastname, token, cat_type_id } = action.payload;
  state.loading = false;
  state.username = username;
  state.role = role;
  state.firstName = firstname;
  state.lastName = lastname;
  state.token = token;
  state.cat_type_id = cat_type_id;
  state.error = null;
  state.loading = false;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.username = '';
      state.role = Role.USER;
      state.firstName = '';
      state.lastName = '';
      state.token = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authAPI.endpoints.userLogin.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.userLogin.matchFulfilled, (state, action) => {
        _updateUserState(state, action);
      })
      .addMatcher(authAPI.endpoints.userLogin.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addMatcher(authAPI.endpoints.adminLogin.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.adminLogin.matchFulfilled, (state, action) => {
        _updateUserState(state, action);
      })
      .addMatcher(authAPI.endpoints.adminLogin.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      .addMatcher(authAPI.endpoints.userLogout.matchFulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addMatcher(authAPI.endpoints.userLogout.matchRejected, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export default authSlice.reducer;
