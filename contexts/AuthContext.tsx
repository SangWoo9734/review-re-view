'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User, getClientAuthState, logout as logoutUser } from '@/lib/auth';
import { authService } from '@/lib/api/authService';

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
    // GitHub OAuth 로그인 서비스 사용
    authService.redirectToGitHubAuth();
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