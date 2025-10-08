import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<{
  user: User;
  isNewUser: boolean;
}> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if this is a new user by looking in Firestore
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    const isNewUser = !userDoc.exists();

    if (isNewUser) {
      // Create basic user document for new Google users
      const userData = {
        uid: user.uid,
        email: user.email?.toLowerCase() || "",
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        phone: "",
        companyName: "", // Will be filled during registration completion
        country: "", // Will be filled during registration completion
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: user.emailVerified,
        isSSORegistration: true,
        authCode: false,
        registrationComplete: false, // Flag to indicate incomplete registration
      };

      await setDoc(userDocRef, userData);
    }

    return { user, isNewUser };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const handleSignInWithCustomToken = async (
  customToken: string,
  redirectPath: string = "/dashboard"
): Promise<void> => {
  // Show loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  loadingDiv.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <div class="text-gray-700">Signing in...</div>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    const _user = userCredential.user;

    // Redirect to the specified path
    window.location.href = redirectPath;
  } catch (error) {
    // Remove loading screen
    document.body.removeChild(loadingDiv);

    console.error("Custom token sign-in error:", error);
    throw error;
  }
};
