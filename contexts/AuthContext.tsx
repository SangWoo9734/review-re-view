'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User, getClientAuthState, logout as logoutUser } from '@/lib/auth';

interface AuthContextType extends AuthState {
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  const refreshAuth = () => {
    const newAuthState = getClientAuthState();
    setAuthState(newAuthState);
    setLoading(false);
  };

  const login = () => {
    // GitHub OAuth URL로 리다이렉트
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/github`;
    const scope = 'repo user:email';
    const state = Math.random().toString(36).substring(2, 15);

    const params = new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri,
      scope,
      state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  const logout = async () => {
    setLoading(true);
    const success = await logoutUser();
    if (success) {
      setAuthState({ isAuthenticated: false, user: null });
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value: AuthContextType = {
    ...authState,
    loading,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}