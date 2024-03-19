// src/store/api/catsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/config'; // Ensure this points to your backend server
import { ICat, IPaginationParams, IPaginationResult } from '@/types'; // Adjust the import paths as necessary

export const catsApi = createApi({
  reducerPath: 'catsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/cats`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTopFiveCats: builder.query<ICat[], void>({
      query: () => 'top-five',
    }),
    searchCats: builder.query<IPaginationResult<ICat>, IPaginationParams>({
      query: ({ search: searchTerm, page = 1, limit = 10 }) =>
        `search?search=${searchTerm}&page=${page}&limit=${limit}`,
    }),
    getCatById: builder.query<ICat, string>({
      query: (id) => `id/${id}`,
    }),
    voteForCat: builder.mutation<void, { catId: string; userId: string }>({
      query: ({ catId }) => ({
        url: `vote/${catId}`,
        method: 'POST',
      }),
    }),
    removeVoteForCat: builder.mutation<void, { catId: string; userId: string }>({
      query: ({ catId }) => ({
        url: `vote/${catId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTopFiveCatsQuery,
  useSearchCatsQuery,
  useGetCatByIdQuery,
  useVoteForCatMutation,
  useRemoveVoteForCatMutation,
} = catsApi;
