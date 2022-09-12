import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useConfirm } from "material-ui-confirm";

import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { fetchRemovePosts } from "../../redux/slices/posts";
import Modal from "../Modal";

import styles from "./Post.module.scss";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    try {
      confirm({
        cancellationText: "Отмена",
        confirmationText: "Удалить",
        title: "Вы действительно хотите удалить статью?",
      }).then(() => {
        dispatch(fetchRemovePosts(id));
        navigate("/");
      });
    } catch (err) {
      console.log(err);
      setIsModalOpen(true);
      setTimeout(function () {
        setIsModalOpen(false);
      }, 4000);
    }
  };

  return (
    <>
      <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
        {isEditable && (
          <div className={styles.editButtons}>
            <Link to={`/posts/${id}/edit`}>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={onClickRemove} color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {imageUrl && (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={
              imageUrl.indexOf("http") < 0
                ? `http://localhost:4444${imageUrl}`
                : imageUrl
            }
            alt={title}
          />
        )}
        <div className={styles.wrapper}>
          <UserInfo {...user} additionalText={createdAt} />
          <div className={styles.indention}>
            <h2
              className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            >
              {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
            </h2>
            <ul className={styles.tags}>
              {tags &&
                tags.map((name) => (
                  <li key={name}>
                    <Link to={`/category/${name}`}>#{name}</Link>
                  </li>
                ))}
            </ul>
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
              <li>
                <EyeIcon />
                <span>{viewsCount}</span>
              </li>
              <li>
                <CommentIcon />
                <span>{commentsCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} text={"Не удалось удалить статью"} />
    </>
  );
};
