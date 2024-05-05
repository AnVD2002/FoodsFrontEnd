import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  const login = (token, expiry) => {
    Cookies.set("accessToken", token);
    Cookies.set("expiryToken", expiry);
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("expiryToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
