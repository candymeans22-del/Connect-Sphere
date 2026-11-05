import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Keep the browser storage in sync, so the login survives a page refresh
store.subscribe(() => {
  const { token, user } = store.getState().auth;

  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");

  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
});

export default store;