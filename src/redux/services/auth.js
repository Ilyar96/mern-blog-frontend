import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    authMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useAuthMeQuery, useLoginMutation, useRegisterMutation } =
  authApi;
