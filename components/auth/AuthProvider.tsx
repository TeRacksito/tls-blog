'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  deleteAuthTokenClient,
  getAuthTokenClient,
} from '@/lib/auth/cookies-client';
import type { AuthUser } from '@/lib/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  openLoginModal: (errorMessage?: string) => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const openLoginModal = useCallback((errorMessage?: string) => {
    setError(errorMessage || null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setError(null);
    setIsLoginModalOpen(false);
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async (silent = false) => {
    try {
      const token = getAuthTokenClient();

      if (!token) {
        setUser(null);
        if (!silent) setIsLoading(false);
        return false;
      }

      const response = await fetch('/nextapi/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setUser({
            user: data.user,
            iat: 0,
            exp: data.exp,
          });
          if (!silent) setIsLoading(false);
          return true;
        }
      }

      deleteAuthTokenClient();
      setUser(null);
      if (!silent) setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      deleteAuthTokenClient();
      setUser(null);
      if (!silent) setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Initial auth check on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    void initAuth();
  }, [checkAuth]);

  /**
   * Check auth on pathname change (route navigation)
   */
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isLoading) {
        await checkAuth(true);
      }
    };
    void verifyAuth();
  }, [pathname, isLoading, checkAuth]);

  /**
   * Periodic auth check
   */
  useEffect(() => {
    const interval = setInterval(
      () => {
        void checkAuth(true).then((isValid) => {
          if (!isValid && user) {
            openLoginModal('Your session has expired. Please login again.');
          }
        });
      },
      1 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [checkAuth, user, openLoginModal]);

  /**
   * Login function
   */
  const login = useCallback(
    async (username: string, password: string) => {
      const response = await fetch('/nextapi/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username, pass: password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      setUser({
        user: data.user,
        iat: 0,
        exp: 0,
      });

      setIsLoginModalOpen(false);
      setError(null);
      router.refresh();
    },
    [router]
  );

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    try {
      await fetch('/nextapi/logout', {
        method: 'POST',
        credentials: 'include',
      });

      deleteAuthTokenClient();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoginModalOpen,
        error,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
