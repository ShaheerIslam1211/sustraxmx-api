// authHelper.ts
import { getAuth, signOut } from "firebase/auth";
import { message } from "antd";

export const handleLogout = (): void => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      message.success("You have been logged out.");
    })
    .catch(_error => {
      message.error("Failed to log out.");
    });
};

export const isAuthenticated = (
  _username: string,
  _password: string
): boolean => {
  return true;
};
