import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { Post } from "../components/Post";
import { getCorrectDate, getCorrectTime } from "../utils/getCorrectDate";
import { selectUser } from "../redux/services/authSlice";
import {
  useGetPostCommentsQuery,
  useGetPostQuery,
} from "../redux/services/post";

export const FullPost = () => {
  const { id } = useParams();
  const userData = useSelector(selectUser);
  const {
    data,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useGetPostQuery(id);
  const { data: comments = [], isLoading: isCommentsLoading } =
    useGetPostCommentsQuery(id);

  const commentsCount = comments.length;

  if (isPostLoading || isCommentsLoading) {
    return (
      <>
        {isPostLoading && <Post isLoading={true} />}
        {isCommentsLoading && <CommentsBlock isLoading={true} />}
      </>
    );
  }

  if (isPostError) {
    return <Navigate to="/" />;
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
          isLoading={isPostLoading}
          isEditable={userData?._id === data.user?._id}
        >
          <ReactMarkdown children={data.text} />
        </Post>
      )}
      {
        <CommentsBlock items={comments} isLoading={isCommentsLoading}>
          <Index />
        </CommentsBlock>
      }
    </>
  );
};
