import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { fetchPosts } from "../redux/slices/posts";
import { getCorrectTime, getCorrectDate } from "../utils/getCorrectDate";
import { selectUser } from "../redux/slices/auth";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";

export const PostsByTag = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector(selectUser);
  const { tag } = useParams();

  const isPostLoading = posts.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts(`tag=${tag}`));
    // eslint-disable-next-line
  }, [tag]);

  return (
    <>
      <h1>#{tag}</h1>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostLoading ? (
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
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user?._id}
              />
            )
          )}
        </Grid>
        <Sidebar />
      </Grid>
    </>
  );
};
