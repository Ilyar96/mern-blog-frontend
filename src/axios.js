import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

//Middleware? который проверяет авторизованы мы или нет
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");

  return config;
});

export default instance;
