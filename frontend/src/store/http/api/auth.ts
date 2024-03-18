import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/config';
import { ILoginResult, ILoginParams } from '../../../../../backend/src/auth/auth.types';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    userLogin: builder.mutation<ILoginResult, ILoginParams>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ILoginResult) => response,
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

// Export hooks for both mutations
export const {
  useUserLoginMutation,
  // useAdminLoginMutation
} = authAPI;
