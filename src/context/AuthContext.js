import { createContext, useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { } from "./authService";
import { setAccessToken } from "./api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = (token) => {
    setAccessToken(token);
    setTokenState(token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setUser(decoded);
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      logout,
      loading,
    }),
    [user, accessToken, loading]
  );

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};