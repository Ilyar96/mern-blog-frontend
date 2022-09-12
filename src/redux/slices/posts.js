import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params = "") => {
    const { data } = await axios.get(`/posts/?${params}`);
    return data;
  }
);

export const fetchSinglePost = createAsyncThunk(
  "posts/fetchSinglePost",
  async (id) => {
    const { data } = await axios.get(`/posts/${id}`);
    return data;
  }
);

export const fetchRemovePosts = createAsyncThunk(
  "posts/fetchRemovePosts",
  async (id) => {
    await axios.delete(`/posts/${id}`);
    const { data: posts } = await axios.get("/posts");
    const { data: tags } = await axios.get("/tags");
    return { posts, tags };
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchPostComments = createAsyncThunk(
  "posts/fetchPostComments",
  async (postId) => {
    const { data } = await axios.get(`/comments/${postId}`);
    return data;
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (params = "") => {
    const { data: comments } = await axios.get(`/comments`);
    let lastComments;
    if (params) {
      lastComments = await axios.get(`/comments?${params}`);
    }

    const sortComments = {};

    comments.forEach((comment) => {
      if (sortComments[comment.postId]) {
        sortComments[comment.postId].push(comment);
      } else {
        sortComments[comment.postId] = [comment];
      }
    });

    return { comments: sortComments, lastComments: lastComments.data };
  }
);

export const fetchAddComments = createAsyncThunk(
  "posts/fetchAddComments",
  async (params) => {
    const { data } = await axios.post("/comments", params);
    return data;
  }
);

export const fetchRemoveComment = createAsyncThunk(
  "posts/fetchRemoveComment",
  async (id) => {
    const { data } = await axios.delete(`/comments/${id}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  singlePost: {
    data: {},
    status: "loading",
    comments: {
      items: {},
      status: "loading",
    },
  },
  lastComments: {
    items: [],
    status: "loading",
  },
  comments: {
    items: {},
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    //Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = [...action.payload];
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Получение отдельной статьи
    [fetchSinglePost.pending]: (state) => {
      state.singlePost.data = {};
      state.singlePost.status = "loading";
    },
    [fetchSinglePost.fulfilled]: (state, action) => {
      state.singlePost.data = action.payload;
      state.singlePost.status = "loaded";
    },
    [fetchSinglePost.rejected]: (state) => {
      state.singlePost.data = {};
      state.singlePost.status = "error";
    },
    //Удаление статьи
    [fetchRemovePosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchRemovePosts.fulfilled]: (state, action) => {
      const { posts, tags } = action.payload;

      state.posts.items = posts;
      state.tags.items = tags;
      state.posts.status = "loaded";
    },
    [fetchRemovePosts.rejected]: (state) => {
      state.posts.status = "error";
    },
    //Добавление тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = [...action.payload];
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    //Получение комментариев
    [fetchPostComments.pending]: (state) => {
      state.singlePost.comments.status = "loading";
    },
    [fetchPostComments.fulfilled]: (state, action) => {
      state.singlePost.comments.items = action.payload;
      state.singlePost.comments.status = "loaded";
    },
    [fetchPostComments.rejected]: (state) => {
      state.singlePost.comments.status = "error";
    },
    //Получение комментариев
    [fetchComments.pending]: (state) => {
      state.lastComments.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      if (action.payload.lastComments) {
        state.lastComments.items = action.payload.lastComments;
      }
      state.comments.items = action.payload.comments;
      state.lastComments.status = "loaded";
    },
    [fetchComments.rejected]: (state) => {
      state.lastComments.status = "error";
    },
    //Добавление комментария
    [fetchAddComments.pending]: (state) => {
      state.singlePost.comments.status = "loading";
    },
    [fetchAddComments.fulfilled]: (state) => {
      state.singlePost.comments.status = "loaded";
    },
    [fetchAddComments.rejected]: (state) => {
      state.singlePost.comments.status = "error";
    },
    //Удаление комментария
    [fetchRemoveComment.pending]: (state) => {
      state.singlePost.comments.status = "loading";
    },
    [fetchRemoveComment.fulfilled]: (state) => {
      state.singlePost.comments.status = "loaded";
    },
    [fetchRemoveComment.rejected]: (state) => {
      state.singlePost.comments.status = "error";
    },
  },
});

export const selectSinglePost = (state) => state.posts.singlePost;
export const selectSinglePostComments = (state) =>
  state.posts.singlePost.comments;

export const postsReducer = postsSlice.reducer;
