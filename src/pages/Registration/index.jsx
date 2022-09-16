import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { selectIsAuth } from "../../redux/services/authSlice";
import Modal from "../../components/Modal";
import { useUploadImageMutation } from "../../redux/services/post";
import { useRegisterMutation } from "../../redux/services/auth";

import styles from "./Login.module.scss";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const [imageUrl, setImageUrl] = useState("");
  const inputFileRef = useRef(null);
  const [uploadImage, { isError: isUploadError }] = useUploadImageMutation();
  const [
    registerUser,
    { isSuccess: isRegisterSuccess, isError: isRegisterError },
  ] = useRegisterMutation();

  const modalText = isUploadError
    ? "Не удалось загрузить изображение"
    : "Не удалось зарегистрироваться";
  const isError = isRegisterError || isUploadError;

  const formSchema = Yup.object().shape({
    fullName: Yup.string().required("Введите полное имя"),
    email: Yup.string()
      .required("Введите email")
      .email("Неправильный формат email"),
    password: Yup.string()
      .required("Введите пароль")
      .min(5, "Минимальная длина пароля 5 символа"),
    passwordConfirm: Yup.string()
      .required("Повторно введите пароль")
      .oneOf([Yup.ref("password")], "Пароли не совпадают"),
  });

  const validationOpt = {
    resolver: yupResolver(formSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm(validationOpt);

  const onSubmit = async (values) => {
    const { passwordConfirm, ...fetchData } = values;
    fetchData.avatarUrl = imageUrl ? `http://localhost:4444${imageUrl}` : "";

    const { data } = await registerUser(fetchData);

    if (data?.token) {
      window.localStorage.setItem("token", data.token);
    }
  };

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      const { data } = await uploadImage(formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
    }
  };

  if (isAuth || isRegisterSuccess) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Paper classes={{ root: styles.root }} elevation={0}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Создание аккаунта
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.avatar}>
            <Avatar
              onClick={() => inputFileRef.current.click()}
              src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
              sx={{ width: 100, height: 100 }}
            />
          </div>
          <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
            accept="image/x-png,image/gif,image/jpeg,image/webp"
          />
          <TextField
            className={styles.field}
            label="Полное имя"
            fullWidth
            error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            {...register("fullName")}
          />
          <TextField
            className={styles.field}
            label="E-Mail"
            fullWidth
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            className={styles.field}
            label="Пароль"
            fullWidth
            type="password"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register("password")}
          />
          <TextField
            className={styles.field}
            label="Повторный пароль"
            fullWidth
            type="password"
            error={Boolean(errors.passwordConfirm?.message)}
            helperText={errors.passwordConfirm?.message}
            {...register("passwordConfirm")}
          />
          <Button
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            disabled={!isValid}
          >
            Зарегистрироваться
          </Button>
        </form>
      </Paper>
      <Modal isOpen={isError} text={modalText} />
    </>
  );
};
