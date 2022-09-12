import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { Post } from "../components/Post";
import { getCorrectDate, getCorrectTime } from "../utils/getCorrectDate";
import { selectUser } from "../redux/slices/auth";
import {
  fetchPostComments,
  fetchSinglePost,
  selectSinglePost,
} from "../redux/slices/posts";

export const FullPost = () => {
  const { data, status, comments } = useSelector(selectSinglePost);
  const { id } = useParams();
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();

  const isExistComments = comments.items?.length > 0;
  const isCommentsLoading = comments.status === "loading";
  const commentsCount = comments.items.length;

  useEffect(() => {
    dispatch(fetchSinglePost(id));
    dispatch(fetchPostComments(id));
    // eslint-disable-next-line
  }, [id]);

  if (status === "loading") {
    return (
      <>
        <Post isLoading={true} />
        <CommentsBlock isLoading={true} />
      </>
    );
  }

  return (
    <>
      {data?._id && (
        <Post
          id={data._id}
          title={data.title}
          imageUrl={data.imageUrl}
          user={data.user}
          createdAt={`
						${getCorrectDate(data.createdAt)} 
						${getCorrectTime(data.createdAt)}
					`}
          viewsCount={data.viewsCount}
          commentsCount={commentsCount}
          tags={data.tags}
          isFullPost
          isLoading={status === "loading"}
          isEditable={userData?._id === data.user?._id}
        >
          <ReactMarkdown children={data.text} />
        </Post>
      )}
      {
        <CommentsBlock
          items={isExistComments ? comments.items : []}
          isLoading={isCommentsLoading === "loading"}
        >
          <Index />
        </CommentsBlock>
      }
    </>
  );
};
