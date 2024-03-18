import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/config';
import { ILoginResult, ILoginParams } from '../../../../../backend/src/auth/auth.types';

const ENDPOINT_AUTH = '/auth';
export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (
      headers
      // , { getState }
    ) => {
      // Optionally, you can add more headers here
      return headers;
    },
    credentials: 'include', // Includes credentials in the request for handling cookies
  }),
  endpoints: (builder) => ({
    userLogin: builder.mutation<ILoginResult, ILoginParams>({
      query: (credentials) => ({
        url: `${ENDPOINT_AUTH}/login`,
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ILoginResult) => response,
    }),
    userLogout: builder.mutation<void, void>({
      query: () => ({
        url: `${ENDPOINT_AUTH}/logout`,
        method: 'POST',
      }),
      // Note: No transformResponse needed as we expect no return data
    }),
    // adminLogin: builder.mutation<ILoginResult, ILoginParams>({
    //   query: (credentials) => ({
    //     url: '/admin-login',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    //   transformResponse: (response: ILoginResult) => response,
    // }),
  }),
});

// Export hooks for mutations
export const {
  useUserLoginMutation,
  useUserLogoutMutation,
  // useAdminLoginMutation
} = authAPI;
