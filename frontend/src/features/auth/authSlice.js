import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

console.log("call initial state");
const initialState = {
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: Boolean(localStorage.getItem("token")),
};

console.log("user data from initial state", initialState);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    // on profile successful
    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
      }
    );

    // when getProfile fail (token expired / unauthorized)
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        if (action?.payload?.status === 401) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
        }
      }
    );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
