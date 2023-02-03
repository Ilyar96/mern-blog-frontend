import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth";

const initialState = {
	token: window.localStorage.getItem("token"),
	user: null,
};

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
				const { token, ...user } = action.payload;
				state.token = token;
				state.user = user;
			})
			.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
				console.log("rejected", action);
			})
			.addMatcher(authApi.endpoints.authMe.matchFulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addMatcher(authApi.endpoints.authMe.matchRejected, (state, action) => {
				console.log("rejected", action);
			});
	},
});

export const selectIsAuth = (state) => Boolean(state.auth.user);
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const { logout } = slice.actions;
export default slice.reducer;
