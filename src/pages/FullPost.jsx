import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "../axios";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { Post } from "../components/Post";
import { getCorrectDate, getCorrectTime } from "../utils/getCorrectDate";

export const FullPost = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/posts/${id}`).then(({ data }) => setData(data));
  }, [id]);

  if (!data) {
    return <Post isLoading={true} />;
  }

  return (
    <>
      {
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
          commentsCount={3}
          tags={data.tags}
          isFullPost
          isLoading={!data._id}
        >
          <p>{data.text}</p>
        </Post>
      }
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
