import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Pagination } from "@mui/material";
import { animateScroll as scroll } from "react-scroll";

import { Post } from "../components/Post";
import { getCorrectTime, getCorrectDate } from "../utils/getCorrectDate";
import { selectUser } from "../redux/services/authSlice";
import { useParams } from "react-router-dom";
import { useGetCommentsQuery, useGetTagsQuery } from "../redux/services/posts";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

import styles from "./BlogLayout.module.scss";

export const BlogLayout = ({
	data,
	isPostLoading,
	limit,
	page,
	paginationChangeHandler,
	activeTab,
	tabChangeHandler,
}) => {
	const userData = useSelector(selectUser);
	const { tag } = useParams();
	const { data: tags = [], isFetching: isTagsLoading } = useGetTagsQuery();
	const { data: comments = [], isFetching: isCommentsLoading } =
		useGetCommentsQuery();

	const isCategoryPage = !!tag;

	const scrollToTop = () => {
		scroll.scrollToTop();
	};

	useEffect(() => {
		if (data?.pagesCount > 1) {
			scrollToTop();
		}
		// eslint-disable-next-line
	}, [page]);

	return (
		<Grid container spacing={4}>
			{!isCategoryPage ? (
				<Tabs
					className={styles.tabs}
					value={activeTab}
					onChange={tabChangeHandler}
				>
					<Tab label="Новые" />
					<Tab label="Популярные" />
				</Tabs>
			) : (
				<h1 className={styles.tabs}>#{tag}</h1>
			)}
			<Grid className={styles.posts} xs={8} item>
				{(isPostLoading ? [...Array(limit)] : data?.data ? data.data : []).map(
					(obj, index) => {
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
					}
				)}
			</Grid>
			<Grid className={styles.sidebar} xs={4} item>
				<TagsBlock items={tags} isLoading={isTagsLoading} />
				<CommentsBlock
					items={comments ? comments.slice(0, 5) : []}
					isLoading={isCommentsLoading}
				/>
			</Grid>
			{data?.pagesCount > 1 && (
				<Grid className={styles.pagination} item xs={8} justifyContent="center">
					<Pagination
						size="large"
						count={data?.pagesCount}
						page={page}
						onChange={paginationChangeHandler}
						shape="rounded"
					/>
				</Grid>
			)}
		</Grid>
	);
};
