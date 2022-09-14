import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params = "") => `/posts/?${params}`,
      providesTags: ["Posts", "Comments"],
    }),
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
    }),
    getTags: builder.query({
      query: () => `/tags`,
      providesTags: ["Posts"],
    }),
    getComments: builder.query({
      query: () => `/comments`,
      providesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetTagsQuery,
  useGetCommentsQuery,
} = postsApi;
