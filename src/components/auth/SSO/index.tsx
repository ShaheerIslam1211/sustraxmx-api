"use client";

import React from "react";
import { message, Tooltip } from "antd";
import { GoogleOutlined, WindowsOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  getAuth,
  OAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface SSOProps {
  onGoogleSignIn?: (user: any, isNewUser: boolean) => void;
  onMicrosoftSignIn?: (user: any, isNewUser: boolean) => void;
}

const auth = getAuth();

const SSOButton = ({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) => (
  <Tooltip title={title}>
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        transition: "transform 0.2s ease",
        borderRadius: "4px",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  </Tooltip>
);

export const SSO = ({ onGoogleSignIn, onMicrosoftSignIn }: SSOProps) => {
  return (
    <div className="sso-container">
      <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
        <SSOButton onClick={signInWithMicrosoft} title="Sign in with Microsoft">
          <WindowsOutlined style={{ fontSize: "32px", color: "#00a4ef" }} />
        </SSOButton>
        <SSOButton onClick={signInWithGoogle} title="Sign in with Google">
          <GoogleOutlined style={{ fontSize: "32px", color: "#4285f4" }} />
        </SSOButton>
      </div>
    </div>
  );
};

export const signInWithMicrosoft = async () => {
  try {
    const microsoftProvider = new OAuthProvider("microsoft.com");

    // Sign in with Microsoft popup
    const result = await signInWithPopup(auth, microsoftProvider);
    const user = result.user;

    console.log("Signed-in user:", user);
    message.success("Successfully signed in with Microsoft!");
  } catch (error) {
    const firebaseError = error as FirebaseError;

    if (
      firebaseError.code === "auth/account-exists-with-different-credential"
    ) {
      const email = firebaseError.customData?.email as string;
      const pendingCred = OAuthProvider.credentialFromError(firebaseError);

      if (email && pendingCred) {
        try {
          // Fetch sign-in methods associated with the email
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);

          if (
            signInMethods.includes(
              EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
            )
          ) {
            // Prompt the user to sign in with their email/password account
            const password = prompt(
              "Your account is not linked with SSO. Please enter your password here to link accounts:"
            );

            if (password) {
              const credential = EmailAuthProvider.credential(email, password);

              // Sign in with email/password and link the Microsoft account
              const userCredential = await signInWithCredential(
                auth,
                credential
              );
              await linkWithCredential(userCredential.user, pendingCred);
              message.success("Accounts linked successfully!");
            } else {
              message.error("Password is required to link accounts");
            }
          } else {
            message.error("Please sign in with your existing account.");
          }
        } catch (linkError) {
          console.error("Error linking accounts:", linkError);
          message.error("Error linking accounts. Please try again.");
        }
      }
    } else {
      console.error("Error during Microsoft sign-in:", firebaseError);
      message.error(
        `Microsoft sign-in failed: ${firebaseError.message || "Unknown error"}`
      );
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Signed-in user:", user);
    message.success("Successfully signed in with Google!");
  } catch (error) {
    const firebaseError = error as FirebaseError;

    if (
      firebaseError.code === "auth/account-exists-with-different-credential"
    ) {
      const email = firebaseError.customData?.email as string;
      const pendingCred = GoogleAuthProvider.credentialFromError(firebaseError);

      if (email && pendingCred) {
        try {
          // Fetch sign-in methods associated with the email
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);

          if (
            signInMethods.includes(
              EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
            )
          ) {
            // Prompt the user to sign in with their email/password account
            const password = prompt(
              "Your account is not linked with SSO. Please enter your password here to link accounts:"
            );

            if (password) {
              const credential = EmailAuthProvider.credential(email, password);

              // Sign in with email/password and link the Google account
              const userCredential = await signInWithCredential(
                auth,
                credential
              );
              await linkWithCredential(userCredential.user, pendingCred);
              message.success("Accounts linked successfully!");
            } else {
              message.error("Password is required to link accounts");
            }
          } else {
            message.error("Please sign in with your existing account.");
          }
        } catch (linkError) {
          console.error("Error linking accounts:", linkError);
          message.error("Error linking accounts. Please try again.");
        }
      }
    } else {
      console.error("Error during Google sign-in:", firebaseError);
      message.error(
        `Google sign-in failed: ${firebaseError.message || "Unknown error"}`
      );
    }
  }
};
