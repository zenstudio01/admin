// src/context/AuthContext.jsx

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/auth.service";
import storage from "../utils/storage";

export const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] = useState(
    storage.getUser()
  );

  const [loading, setLoading] =
    useState(true);

  const [authError, setAuthError] =
    useState(null);

  const loadProfile =
    useCallback(async () => {
      const accessToken =
        storage.getAccessToken();

      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response =
          await authService.checkAuthentication();

        const currentUser =
          response.user;

        if (!currentUser) {
          throw new Error(
            "The backend did not return the authenticated user."
          );
        }

        setUser(currentUser);
        storage.setUser(currentUser);
      } catch {
        storage.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (
    credentials
  ) => {
    setAuthError(null);

    try {
      const response =
        await authService.login(
          credentials
        );

      const accessToken =
        response.access_token;

      const refreshToken =
        response.refresh_token;

      const authenticatedUser =
        response.user;

      if (
        !accessToken ||
        !refreshToken ||
        !authenticatedUser
      ) {
        throw new Error(
          "The login response is incomplete."
        );
      }

      storage.setTokens({
        access: accessToken,
        refresh: refreshToken,
      });

      storage.setUser(
        authenticatedUser
      );

      setUser(authenticatedUser);

      return response;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const register = async (data) => {
    setAuthError(null);

    try {
      return await authService.register(
        data
      );
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      login,
      register,
      logout,
      loadProfile,
      clearAuthError,
      isAuthenticated:
        Boolean(user),
    }),
    [
      user,
      loading,
      authError,
      loadProfile,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}