// src/context/AuthContext.tsx

import { createContext, useState, useContext, useEffect, type ReactNode, useCallback, useMemo } from 'react';
import { login as loginService, logout as logoutService, type ILoginCredentials, type UserProfile } from '../services/AuthService';
import axios from 'axios';
import { errorAlert } from '../js/alerts';

interface AuthContextType {
  isAuthenticated: boolean;
  authorities: string[];
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => void;
  hasAuthority: (permission: string) => boolean;
  user: UserProfile | null;
  loginSuccess: boolean;
  loading: boolean;

}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const tabId = useMemo(() => Date.now().toString(), []);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('userProfile');
    const storedAuthorities = localStorage.getItem('userAuthorities');
    const activeTab = localStorage.getItem('activeTab');


    if (token && storedAuthorities && storedUser) {
      if (activeTab && activeTab !== tabId) {
        setIsAuthenticated(false);
        setUser(null);
        setAuthorities([]);
        setLoginSuccess(false);
        errorAlert("Ya hay una sesión activa en otra pestaña.");
        setLoading(false);
        return;
      }
      try {

        setIsAuthenticated(true);
        setAuthorities(JSON.parse(storedAuthorities));
        setUser(JSON.parse(storedUser) as UserProfile);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error al parsear datos de sesión desde localStorage", error);
        logoutService();
      }
    }
    setLoading(false);
  }, [tabId]);



  const login = useCallback(async (credentials: ILoginCredentials) => {

    const existingActiveTab = localStorage.getItem('activeTab');
    if (existingActiveTab && existingActiveTab !== tabId) {
      errorAlert("Ya hay una sesión activa en otra pestaña.");
      return;
    }
    const response = await loginService(credentials);
    setIsAuthenticated(true);
    setAuthorities(response.authorities || []);
    setUser(response.user || null);
    setLoginSuccess(true);
    localStorage.setItem('activeTab', tabId);
  }, [tabId]);

  const logout = useCallback(() => {
    const currentActiveTab = localStorage.getItem('activeTab');
    if (currentActiveTab === tabId) {
      localStorage.removeItem('activeTab');
    }
    logoutService();
    setAuthorities([]);
    setIsAuthenticated(false);
    setUser(null);
    setLoginSuccess(false);
  }, [tabId]);

  useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'activeTab') {
      const current = localStorage.getItem('activeTab');
      if (current !== tabId) {
        logout();
        errorAlert("Sesión activa en otra pestaña.");
      }
    }
  };
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, [logout, tabId]);

useEffect(() => {
  const handleBeforeUnload = () => {
    const currentActiveTab = localStorage.getItem('activeTab');
    if (currentActiveTab === tabId) {
      localStorage.removeItem('activeTab');
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [tabId]);


  const hasAuthority = useCallback((authority: string) => {
    return authorities.includes(authority);
  }, [authorities]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    authorities,
    user,
    login,
    logout,
    hasAuthority,
    loginSuccess,
    loading

  }), [isAuthenticated, authorities, user, login, logout, hasAuthority, loginSuccess, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};