import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4444",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Posts", "Tags", "Comments", "Auth"],
  endpoints: () => ({}),
});
