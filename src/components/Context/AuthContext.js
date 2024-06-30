import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import Cookies from "js-cookie";

import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const getAccessToken = () => Cookies.get("accessToken");
  const getRefreshToken = () => Cookies.get("refreshToken");

  const setTokens = (accessToken, refreshToken) => {
    const options = rememberMe ? { expires: 7 } : undefined;
    Cookies.set("accessToken", accessToken, options);
    Cookies.set("refreshToken", refreshToken, options);
  };

  const clearTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  const logout = useCallback(() => {
    clearTokens();
    setIsLoggedIn(false);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  }, [logoutTimer]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/account/refreshToken",
          { refreshToken }
        );
        const { accessToken } = response.data;
        setTokens(accessToken, refreshToken);
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        setIsLoggedIn(true);
        setupLogoutTimer((decodedToken.exp - currentTime) * 1000);
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        logout();
      }
    } else {
      logout();
    }
  }, [logout]);

  const setupLogoutTimer = useCallback(
    (millisecondsRemaining) => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      const timer = setTimeout(async () => {
        if (rememberMe) {
          await refreshAccessToken();
        } else {
          logout();
        }
      }, millisecondsRemaining);
      setLogoutTimer(timer);
    },
    [logoutTimer, rememberMe, refreshAccessToken, logout]
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
          setupLogoutTimer((decodedToken.exp - currentTime) * 1000);
        } else {
          await refreshAccessToken();
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(
    (accessToken, refreshToken, remember) => {
      setRememberMe(remember);
      setTokens(accessToken, refreshToken);
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      setIsLoggedIn(true);
      setupLogoutTimer((decodedToken.exp - currentTime) * 1000);
    },
    [setupLogoutTimer]
  );

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const decodedToken = jwtDecode(refreshToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp <= currentTime) {
          logout();
        }
      } catch (error) {
        console.error("Failed to decode refreshToken:", error);
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
