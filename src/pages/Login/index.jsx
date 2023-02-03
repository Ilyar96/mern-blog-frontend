import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Modal from "../../components/Modal";
import { useLoginMutation } from "../../redux/services/auth";
import { selectToken, selectIsAuth } from "../../redux/services/authSlice";

import styles from "./Login.module.scss";

export const Login = () => {
	const isAuth = useSelector(selectIsAuth);
	const token = useSelector(selectToken);
	const [login, { isError }] = useLoginMutation();

	const formSchema = Yup.object().shape({
		email: Yup.string()
			.required("Введите email")
			.email("Неправильный формат email"),
		password: Yup.string().required("Введите пароль"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(formSchema),
		mode: "onChange",
	});

	useEffect(() => {
		if (token) {
			window.localStorage.setItem("token", token);
		}
	}, [token]);

	const onSubmit = (values) => {
		login(values);
	};

	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<Paper elevation={0} classes={{ root: styles.root }}>
				<Typography classes={{ root: styles.title }} variant="h5">
					Вход в аккаунт
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						className={styles.field}
						label="E-Mail"
						error={Boolean(errors.email?.message)}
						helperText={errors.email?.message}
						{...register("email")}
						fullWidth
					/>
					<TextField
						className={styles.field}
						label="Пароль"
						fullWidth
						error={Boolean(errors.password?.message)}
						helperText={errors.password?.message}
						{...register("password")}
					/>
					<Button
						type="submit"
						size="large"
						variant="contained"
						fullWidth
						disabled={!isValid}
					>
						Войти
					</Button>
				</form>
			</Paper>
			<Modal isOpen={isError} text={"Не удалось авторизоваться"}></Modal>
		</>
	);
};
