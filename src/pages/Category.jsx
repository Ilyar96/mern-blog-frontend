import React, { useState } from "react";
import { useGetPostsQuery } from "../redux/services/posts";
import { BlogLayout } from "../layouts/BlogLayout";
import { useParams } from "react-router-dom";

const limit = 5;

export const Category = () => {
  const [page, setPage] = useState(1);
  const { tag } = useParams();

  const { data, isFetching } = useGetPostsQuery(`tag=${tag}`);

  const paginationChangeHandler = (e, val) => {
    setPage(val);
  };

  return (
    <>
      <BlogLayout
        data={data}
        isPostLoading={isFetching}
        limit={limit}
        page={page}
        paginationChangeHandler={paginationChangeHandler}
      />
    </>
  );
};
