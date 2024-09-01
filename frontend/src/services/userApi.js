import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/user/' }), // Base URL specific to user-related endpoints
  endpoints: (builder) => ({
    getAllUserDetails: builder.query({
      query: () => 'find-all',
    }),
    getAllSelectedHomeUser: builder.mutation({
      query: (homeAddress) => ({
        url: 'find-by-home',
        method: 'POST',
        body: homeAddress,
      }),
    }),
  }),
});

export const { useGetAllUserDetailsQuery, useGetAllSelectedHomeUserMutation } = userApi;
