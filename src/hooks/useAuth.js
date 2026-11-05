import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction, updateUser } from "../store/AuthSlice";

// One place for everything about the logged in user.
// Usage: const { guest, user, logout } = useAuth();
export default function useAuth() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const savedUser = useSelector((state) => state.auth.user);

  const guest = !token; // no token = visitor who did not login
  const user = guest ? { name: "Guest", username: "guest" } : savedUser || {};

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
  const updateProfile = useCallback((changes) => dispatch(updateUser(changes)), [dispatch]);

  return { token, guest, user, logout, updateProfile };
}