import React, { useState } from "react";
import { useGetPostsQuery } from "../redux/services/posts";
import { BlogLayout } from "../layouts/BlogLayout";

const limit = 5;

export const Home = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);

  const { data: latestPosts, isFetching: isLatestPostsLoading } =
    useGetPostsQuery(`limit=${limit}&page=${page}`);
  const { data: popularPosts, isFetching: isPopularPostsLoading } =
    useGetPostsQuery(`sortBy=viewsCount&limit=${limit}&page=${page}`);

  const paginationChangeHandler = (e, val) => {
    setPage(val);
  };

  const tabChangeHandler = (e, val) => {
    setActiveTab(val);
    setPage(1);
  };

  return (
    <>
      {activeTab === 0 ? (
        <BlogLayout
          data={latestPosts}
          isPostLoading={isLatestPostsLoading}
          activeTab={activeTab}
          tabChangeHandler={tabChangeHandler}
          limit={limit}
          page={page}
          paginationChangeHandler={paginationChangeHandler}
        />
      ) : (
        <BlogLayout
          data={popularPosts}
          isPostLoading={isPopularPostsLoading}
          activeTab={activeTab}
          tabChangeHandler={tabChangeHandler}
          limit={limit}
          page={page}
          paginationChangeHandler={paginationChangeHandler}
        />
      )}
    </>
  );
};
