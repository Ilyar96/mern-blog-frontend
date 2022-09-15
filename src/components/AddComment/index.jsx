import React, { useState } from "react";
import { useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { selectUser } from "../../redux/services/authSlice";
import Modal from "../Modal";

import styles from "./AddComment.module.scss";
import { useAddCommentMutation } from "../../redux/services/post";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const Index = () => {
  const [text, setText] = useState("");
  const user = useSelector(selectUser);
  const { id: postId } = useParams();
  const [addComment, { isError, isSuccess }] = useAddCommentMutation();

  const isDisabled = !text.length;

  useEffect(() => {
    if (isSuccess) {
      setText("");
    }
  }, [isSuccess]);

  const onSubmit = async () => {
    const commentData = {
      text,
      user,
      postId,
    };

    try {
      await addComment(commentData);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      {user?._id && (
        <>
          <div className={styles.root}>
            <Avatar classes={{ root: styles.avatar }} src={user?.avatarUrl} />

            <div className={styles.form}>
              <TextField
                label="Написать комментарий"
                variant="outlined"
                maxRows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                multiline
                fullWidth
              />
              <Button
                onClick={onSubmit}
                variant="contained"
                disabled={isDisabled}
              >
                Отправить
              </Button>
            </div>
          </div>
          <Modal isOpen={isError} text={"Нe далось добавить комментарий"} />
        </>
      )}
    </>
  );
};
