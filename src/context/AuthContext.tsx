"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "../lib";

// Define user document interface
interface UserDoc {
  uid: string;
  email: string;
  phone: string;
  companyName: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isSSORegistration?: boolean;
  authCode?: boolean;
  registrationComplete?: boolean;
  affiliateId?: string | null;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  userDoc: UserDoc | null | undefined;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
}

// Create a context for auth data
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

// Create a provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserDoc = async (uid: string): Promise<UserDoc | null> => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data() as UserDoc;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user document:", error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);

      // Fetch user document
      const userDoc = await fetchUserDoc(user.uid);
      setUserDoc(userDoc);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const refreshUserDoc = async (): Promise<void> => {
    if (user) {
      const doc = await fetchUserDoc(user.uid);
      setUserDoc(doc);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setUserDoc(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user document from Firestore
        const doc = await fetchUserDoc(currentUser.uid);
        setUserDoc(doc);
      } else {
        setUserDoc(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    userDoc,
    loading,
    login,
    logout,
    refreshUserDoc,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
