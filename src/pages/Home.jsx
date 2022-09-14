import React, { useState } from "react";
import { useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { getCorrectTime, getCorrectDate } from "../utils/getCorrectDate";
import { selectUser } from "../redux/services/authSlice";
import { useParams } from "react-router-dom";
import {
  useGetCommentsQuery,
  useGetPostsQuery,
  useGetTagsQuery,
} from "../redux/services/posts";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const Home = () => {
  const userData = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(0);
  const { tag } = useParams();

  const isCategoryPage = !!tag;

  const posts = useGetPostsQuery();
  const popularPosts = useGetPostsQuery(`sortBy=viewsCount&limit=5`);
  const categoryPosts = useGetPostsQuery(`tag=${tag}`);
  const { data: tags = [], isFetching: isTagsLoading } = useGetTagsQuery();
  const { data: comments = [], isFetching: isCommentsLoading } =
    useGetCommentsQuery();

  const isPostLoading =
    posts.isLoading || categoryPosts.isLoading || popularPosts.isLoading;

  const data = isCategoryPage
    ? categoryPosts.data
    : activeTab === 0
    ? posts.data
    : popularPosts.data;

  const handleChange = (e, val) => {
    setActiveTab(val);
  };

  return (
    <>
      {!isCategoryPage ? (
        <Tabs
          style={{ marginBottom: 15 }}
          value={activeTab}
          aria-label="basic tabs example"
          onChange={handleChange}
        >
          <Tab label="Новые" />
          <Tab label="Популярные" />
        </Tabs>
      ) : (
        <h1>#{tag}</h1>
      )}
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : data).map((obj, index) => {
            const commentsCount = comments.filter(
              (comment) => comment.postId === obj?._id
            ).length;

            return isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj?.imageUrl}
                user={obj.user}
                createdAt={`
									${getCorrectDate(obj.createdAt)} 
									${getCorrectTime(obj.createdAt)}
								`}
                viewsCount={obj.viewsCount}
                commentsCount={commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user?._id}
              />
            );
          })}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags} isLoading={isTagsLoading} />
          <CommentsBlock
            items={comments ? comments.slice(0, 5) : []}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
