import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "./firebase";

interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface CompanyData {
  companyName: string;
  country: string;
}

export const registerUser = async (
  userData: UserRegistrationData,
  companyData: CompanyData,
  affiliateId?: string,
  isSSORegistration: boolean = false
): Promise<User> => {
  try {
    const { firstName, lastName, email, password, phone } = userData;
    const { companyName, country } = companyData;

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );

    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Save additional user data to Firestore
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);

    const userDoc = {
      uid: user.uid,
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone: phone || "",
      companyName,
      country,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: user.emailVerified,
      affiliateId: affiliateId || null,
      isSSORegistration,
      authCode: false, // For 2FA if needed later
    };

    await setDoc(userDocRef, userDoc);

    console.log("User registered successfully:", user);
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const signInNewUser = async (
  userData: UserRegistrationData,
  companyName: string,
  country: string,
  affiliateId?: string,
  isSSORegistration: boolean = false
): Promise<User> => {
  return registerUser(
    userData,
    { companyName, country },
    affiliateId,
    isSSORegistration
  );
};

// Helper function for password reset
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { sendPasswordResetEmail } = await import("firebase/auth");
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
