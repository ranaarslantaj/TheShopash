'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isReady: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const requireAuth = () => {
  if (!auth) {
    throw new Error(
      'Authentication is currently unavailable. Add your Firebase credentials to .env.local to enable sign-in.'
    );
  }
  return auth;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const a = requireAuth();
    await signInWithEmailAndPassword(a, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const a = requireAuth();
    const cred = await createUserWithEmailAndPassword(a, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
  };

  const signInWithGoogle = async () => {
    const a = requireAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(a, provider);
  };

  const resetPassword = async (email: string) => {
    const a = requireAuth();
    await sendPasswordResetEmail(a, email);
  };

  const signOut = async () => {
    if (!auth) return;
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isReady: isFirebaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
