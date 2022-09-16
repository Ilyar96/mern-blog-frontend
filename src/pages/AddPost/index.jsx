import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { selectIsAuth } from "../../redux/services/authSlice";
import Modal from "../../components/Modal";
import {
  useAddPostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useUploadImageMutation,
} from "../../redux/services/post";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);
  const { data: postData } = useGetPostQuery(id);
  const [uploadImage, { isError: isUploadError }] = useUploadImageMutation();
  const [addPost, { isSuccess: isAddingSuccess, isError: isAddingError }] =
    useAddPostMutation();
  const [
    updatePost,
    { isSuccess: isUpdatingSuccess, isError: isUpdatingError },
  ] = useUpdatePostMutation();
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [postId, setPostId] = React.useState(id);
  const [modalText, setModalText] = React.useState(
    id ? "Ошибка при обновлении статьи" : "Ошибка при создании статьи"
  );
  const isError = id ? isUpdatingError : isAddingError;
  const isSuccess = id ? isUpdatingSuccess : isAddingSuccess;

  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!isEditing) {
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
  }, [id, postData?._id]);

  useEffect(() => {
    if (isSuccess && postId) {
      navigate(`/posts/${postId}`);
    }
    // eslint-disable-next-line
  }, [isSuccess, postId]);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      console.log(file);
      formData.append("image", file);
      const { data } = await uploadImage(formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async (e) => {
    try {
      const tagsArr = tags.trim().length
        ? tags.split(",").map((str) => str.trim())
        : [];

      const fields = {
        title,
        imageUrl,
        tags: tagsArr,
        text,
      };

      const { data, error } = isEditing
        ? await updatePost({ id, body: fields })
        : await addPost(fields);

      if (error) {
        setModalText(error.data[0].msg);
      }

      if (data?._id) {
        setPostId(data._id);
      }
    } catch (err) {
      console.log(err);
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
        uniqueId: Math.random(),
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

            <LazyLoadImage
              className={styles.image}
              src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
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
      <Modal isOpen={isError} text={modalText} />
      <Modal isOpen={isUploadError} text={"Не удалось загрузить изображение"} />
    </>
  );
};
