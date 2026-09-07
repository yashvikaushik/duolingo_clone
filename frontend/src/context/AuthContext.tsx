"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { fetchApi } from "@/lib/api";
import { UserProfile, UserSyncPayload } from "@/types";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: UserProfile | null;
  loading: boolean;
  syncing: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<UserProfile>;
  signupWithEmail: (
    email: string,
    password: string,
    username?: string,
    displayName?: string
  ) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  loginWithFacebook: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync user with backend
  const syncWithBackend = async (
    fUser: FirebaseUser,
    customPayload?: UserSyncPayload
  ): Promise<UserProfile> => {
    setSyncing(true);
    try {
      const token = await fUser.getIdToken();
      const payload: UserSyncPayload = {
        email: fUser.email || undefined,
        display_name: customPayload?.display_name || fUser.displayName || undefined,
        avatar_url: customPayload?.avatar_url || fUser.photoURL || undefined,
        username: customPayload?.username,
      };

      const res = await fetchApi<UserProfile>("/auth/sync", {
        method: "POST",
        body: JSON.stringify(payload),
        token,
      });

      if (res.error || !res.data) {
        throw new Error(res.error || "Failed to synchronize profile with backend");
      }

      setDbUser(res.data);
      return res.data;
    } finally {
      setSyncing(false);
    }
  };

  // Fetch current user from backend
  const fetchBackendUser = async (fUser: FirebaseUser) => {
    try {
      const token = await fUser.getIdToken();
      const res = await fetchApi<UserProfile>("/users/me", { token });
      if (res.data) {
        setDbUser(res.data);
      } else {
        // Fallback to sync if user does not exist in DB yet
        await syncWithBackend(fUser);
      }
    } catch {
      await syncWithBackend(fUser);
    }
  };

  // Persistent Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        await fetchBackendUser(currentUser);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return await syncWithBackend(cred.user);
    } catch (err: any) {
      const formatted = mapAuthErrorMessage(err.code || err.message);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const signupWithEmail = async (
    email: string,
    password: string,
    username?: string,
    displayName?: string
  ): Promise<UserProfile> => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateFirebaseProfile(cred.user, { displayName });
      }
      return await syncWithBackend(cred.user, { username, display_name: displayName });
    } catch (err: any) {
      const formatted = mapAuthErrorMessage(err.code || err.message);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const loginWithGoogle = async (): Promise<UserProfile> => {
    setError(null);
    try {
      console.log("[AuthContext] Initiating Google signInWithPopup...");
      const cred = await signInWithPopup(auth, googleProvider);
      console.log("[AuthContext] Firebase Google auth success for:", cred.user.email);
      const user = await syncWithBackend(cred.user);
      console.log("[AuthContext] Backend user sync success:", user);
      return user;
    } catch (err: any) {
      console.error("[AuthContext] Google authentication error:", err);
      const codeOrMsg = err?.code || err?.message || String(err);
      const formatted = mapAuthErrorMessage(codeOrMsg);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const loginWithFacebook = async (): Promise<UserProfile> => {
    setError(null);
    try {
      const cred = await signInWithPopup(auth, facebookProvider);
      return await syncWithBackend(cred.user);
    } catch (err: any) {
      const formatted = mapAuthErrorMessage(err.code || err.message);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
      setDbUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (firebaseUser) {
      await fetchBackendUser(firebaseUser);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        syncing,
        error,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// User-friendly error mapping for Firebase Auth error codes
function mapAuthErrorMessage(codeOrMessage: string): string {
  if (codeOrMessage.includes("auth/email-already-in-use")) {
    return "Email already taken";
  }
  if (codeOrMessage.includes("auth/invalid-credential") || codeOrMessage.includes("auth/wrong-password") || codeOrMessage.includes("auth/user-not-found")) {
    return "Invalid email or password";
  }
  if (codeOrMessage.includes("auth/weak-password")) {
    return "Password should be at least 6 characters";
  }
  if (codeOrMessage.includes("auth/invalid-email")) {
    return "Please enter a valid email address";
  }
  if (codeOrMessage.includes("auth/popup-closed-by-user")) {
    return "Google sign-in popup was closed before completing";
  }
  if (codeOrMessage.includes("auth/popup-blocked")) {
    return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
  }
  if (codeOrMessage.includes("auth/operation-not-allowed")) {
    return "Google sign-in is not enabled in Firebase Console. Please enable Google in Authentication -> Sign-in method.";
  }
  if (codeOrMessage.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized in your Firebase console. Please add localhost to Authorized Domains under Authentication -> Settings.";
  }
  if (codeOrMessage.includes("auth/invalid-api-key")) {
    return "Invalid Firebase API key. Please check your NEXT_PUBLIC_FIREBASE_API_KEY in .env.local.";
  }
  return codeOrMessage.replace(/^Firebase:\s*/, "");
}

