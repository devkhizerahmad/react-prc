import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../services/baseApi";
import { setCredentials } from "./authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (error) {
          // Handle error
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useSignupMutation,
} = authApi;
