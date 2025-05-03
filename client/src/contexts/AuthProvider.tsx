import { useState, useEffect, ReactNode } from "react";
import { User, LoginCredentials, RegisterCredentials } from "../types";
import { authService } from "../services/api";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      authService
        .getProfile()
        .then((response) => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    const { user, accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
    setUser(user);
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await authService.register(credentials);
    const { user, accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: user!, loading, login, register, logout, token: token!, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
