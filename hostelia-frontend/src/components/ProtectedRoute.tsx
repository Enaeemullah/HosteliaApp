import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};
