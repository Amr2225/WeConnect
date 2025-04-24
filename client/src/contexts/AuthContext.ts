import { createContext } from "react";
import { LoginCredentials, RegisterCredentials, User } from "../types";

interface AuthContextType {
  user: User
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
