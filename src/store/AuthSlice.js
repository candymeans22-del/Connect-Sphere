import { createSlice } from "@reduxjs/toolkit";

// Read what was saved last time, so you stay logged in after a refresh
function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

const initialState = {
  token: localStorage.getItem("token") || null,
  user: readSavedUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after a successful login or register
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    // Called when the user logs out (or the token is no longer valid)
    logout(state) {
      state.token = null;
      state.user = null;
    },
    // Called when the user changes their name or username in Settings
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;