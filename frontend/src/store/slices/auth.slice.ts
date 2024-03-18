import { SerializedError, createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../http/api/auth';

export interface IAuthState {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  token: string;
  loading: boolean;
  error: SerializedError | string | null;
}

const initialState: IAuthState = {
  username: '',
  role: '',
  firstName: '',
  lastName: '',
  token: '',
  loading: false,
  error: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // You can also add reducers here if needed
    logOut: (state) => {
      state.username = '';
      state.role = '';
      state.firstName = '';
      state.lastName = '';
      state.token = '';
    },
  },
  extraReducers: (builder) => {
    // Handling userLogin
    builder
      .addMatcher(authAPI.endpoints.userLogin.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.userLogin.matchFulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.firstName = action.payload.firstname; // Ensure these keys match the returned payload
        state.lastName = action.payload.lastname;
        state.token = action.payload.token;
      })
      .addMatcher(authAPI.endpoints.userLogin.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      // Handle logout mutation
      .addMatcher(authAPI.endpoints.userLogout.matchFulfilled, (state) => {
        // Reset state to initial upon logout
        Object.assign(state, initialState);
      })
      .addMatcher(authAPI.endpoints.userLogout.matchRejected, (state) => {
        // Reset state to initial upon logout
        Object.assign(state, initialState);
      });

    // Handling adminLogin similarly
    // builder
    //   .addMatcher(authAPI.endpoints.adminLogin.matchPending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addMatcher(authAPI.endpoints.adminLogin.matchFulfilled, (state, action) => {
    //     state.loading = false;
    //     state.username = action.payload.username;
    //     state.role = action.payload.role;
    //     state.firstName = action.payload.firstname; // Ensure these keys match the returned payload
    //     state.lastName = action.payload.lastname;
    //     state.token = action.payload.token;
    //   })
    //   .addMatcher(authAPI.endpoints.adminLogin.matchRejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error;
    //   });
  },
});

export default authSlice.reducer;
