import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
