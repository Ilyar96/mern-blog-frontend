import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { selectUser } from "../../redux/slices/auth";
import {
  selectSinglePost,
  fetchAddComments,
  fetchPostComments,
} from "../../redux/slices/posts";
import Modal from "../Modal";

import styles from "./AddComment.module.scss";

export const Index = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const user = useSelector(selectUser);
  const { data } = useSelector(selectSinglePost);
  const [modalData, setModalData] = useState({
    isOpen: false,
    text: "",
  });

  const isDisabled = text.length === 0;

  const onChangeModalData = (isOpen, text) => {
    setModalData({
      isOpen,
      text: text,
    });
    setTimeout(function () {
      setModalData({
        isOpen: false,
        text: "",
      });
    }, 4000);
  };

  const onSubmit = async (e) => {
    try {
      const commentData = {
        text,
        user,
        postId: data?._id,
      };

      dispatch(fetchAddComments(commentData)).then((action) => {
        if (action?.error) {
          console.warn(action?.error);

          const errorMessage = null;

          onChangeModalData(
            true,
            errorMessage ? errorMessage : "Ошибка при добавлении комментария"
          );
        } else {
          dispatch(fetchPostComments(action?.payload?.postId));
          setText("");
        }
      });
    } catch (err) {
      console.warn(err);
      const errorMessage = err ? err?.response?.data[0].msg : null;

      onChangeModalData(
        true,
        errorMessage ? errorMessage : "Ошибка при добавлении комментария"
      );
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
          <Modal isOpen={modalData.isOpen} text={modalData.text} />
        </>
      )}
    </>
  );
};
