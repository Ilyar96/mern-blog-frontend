import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { fetchPosts, fetchTags, fetchComments } from "../redux/slices/posts";
import { getCorrectTime, getCorrectDate } from "../utils/getCorrectDate";
import { selectUser } from "../redux/slices/auth";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, comments } = useSelector((state) => state.posts);
  const userData = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(0);
  const { tag } = useParams();

  const isPostLoading = posts.status === "loading";
  const isCategoryPage = !!tag;

  useEffect(() => {
    if (!isCategoryPage) {
      activeTab === 0
        ? dispatch(fetchPosts())
        : dispatch(fetchPosts(`sortBy=viewsCount&limit=5`));
    } else {
      dispatch(fetchPosts(`tag=${tag}`));
    }

    // eslint-disable-next-line
  }, [activeTab, tag]);
  console.log(1);
  useEffect(() => {
    dispatch(fetchTags());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(fetchComments("limit=5"));
    // eslint-disable-next-line
  }, []);

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
                commentsCount={
                  comments.items[obj._id] ? comments.items[obj._id].length : 0
                }
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
