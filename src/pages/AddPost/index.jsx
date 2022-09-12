import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { selectIsAuth } from "../../redux/slices/auth";
import Modal from "../../components/Modal";
import { fetchSinglePost, selectSinglePost } from "../../redux/slices/posts";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);
  const { data: postData } = useSelector(selectSinglePost);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    text: "",
  });

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

  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchSinglePost(id));
    } else {
      setImageUrl("");
      setText("");
      setTitle("");
      setTags("");
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (isEditing && postData?._id) {
      setImageUrl(postData.imageUrl);
      setText(postData.text);
      setTitle(postData.title);
      setTags(postData.tags.join(","));
    }
    // eslint-disable-next-line
  }, [postData]);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      onChangeModalData(true, "Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => setImageUrl("");

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async (e) => {
    const tagsArr = tags.trim().length
      ? tags.split(",").map((str) => str.trim())
      : [];
    try {
      const fields = {
        title,
        imageUrl,
        tags: tagsArr,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const postId = isEditing ? id : data._id;

      navigate(`/posts/${postId}`);
    } catch (err) {
      console.log(err);
      const errorMessage = err ? err?.response?.data[0].msg : null;
      console.warn(err);
      onChangeModalData(
        true,
        errorMessage
          ? errorMessage
          : isEditing
          ? "Ошибка при обновлении статьи"
          : "Ошибка при создании статьи",
        setModalData
      );
    }
  };

  const onTitleChange = (e) => setTitle(e.target.value);

  const onTagsChange = (e) => setTags(e.target.value);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Paper style={{ padding: 30 }} elevation={0}>
        {!imageUrl && (
          <Button
            onClick={() => inputFileRef.current.click()}
            variant="outlined"
            size="large"
          >
            Загрузить превью
          </Button>
        )}
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
          accept="image/x-png,image/gif,image/jpeg,image/webp"
        />
        {imageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Удалить изображение
            </Button>

            <img
              className={styles.image}
              src={`http://localhost:4444${imageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          value={title}
          onChange={onTitleChange}
          fullWidth
        />
        <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Тэги"
          value={tags}
          onChange={onTagsChange}
          fullWidth
        />
        <SimpleMDE
          className={styles.editor}
          value={text}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? "Обновить" : "Опубликовать"}
          </Button>
          <a href="/">
            <Button size="large">Отмена</Button>
          </a>
        </div>
      </Paper>
      <Modal isOpen={modalData.isOpen} text={modalData.text} />
    </>
  );
};
