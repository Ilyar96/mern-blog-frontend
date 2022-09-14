import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params) => `/posts/?${params}`,
      providesTags: ["Posts", "Tags"],
    }),
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: ["Posts", "Tags"],
    }),
    addPost: builder.mutation({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts", "Tags"],
    }),
    updatePost: builder.mutation({
      query: (data) => ({
        url: `/posts/${data.id}`,
        method: "PATCH",
        body: data.body,
      }),
      invalidatesTags: ["Posts", "Tags"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Tags"],
    }),
    uploadImage: builder.mutation({
      query: (body) => ({
        url: `/upload`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts", "Tags"],
    }),
    getPostComments: builder.query({
      query: (postId) => `/comments/${postId}`,
      providesTags: ["Comments"],
    }),
    addComment: builder.mutation({
      query: (body) => ({
        url: "/comments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts", "Comments"],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Comments"],
    }),
    deleteCommentsByPostId: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Comments"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeleteCommentsByPostIdMutation,
  useUploadImageMutation,
} = postApi;
