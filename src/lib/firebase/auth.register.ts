import { auth } from "./firebase"; // Make sure the path to firebase-config is correct
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: username,
    });
    return user;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

export default createUser;
