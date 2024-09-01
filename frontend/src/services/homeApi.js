import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/home/' }), // Base URL specific to home-related endpoints
  endpoints: (builder) => ({
    findUserByHome: builder.mutation({
      query: (username) => ({
        url: 'find-by-user',
        method: 'POST',
        body: username,
      }),
    }),
    updateUserForHome: builder.mutation({
      query: (userData) => ({
        url: 'update-users',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useFindUserByHomeMutation, useUpdateUserForHomeMutation } = homeApi;
