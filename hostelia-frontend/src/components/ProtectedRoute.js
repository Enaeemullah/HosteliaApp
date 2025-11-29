import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
export const ProtectedRoute = () => {
    const { token } = useAuth();
    if (!token) {
        return _jsx(Navigate, { to: "/signin", replace: true });
    }
    return _jsx(Outlet, {});
};
