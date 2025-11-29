import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/client';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const savedToken = localStorage.getItem('hostelia:token');
        const savedUser = localStorage.getItem('hostelia:user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setAuthToken(savedToken);
        }
    }, []);
    const persist = (accessToken, payload) => {
        setToken(accessToken);
        setUser(payload);
        localStorage.setItem('hostelia:token', accessToken);
        localStorage.setItem('hostelia:user', JSON.stringify(payload));
        setAuthToken(accessToken);
    };
    const signin = async (input) => {
        const { data } = await api.post('/auth/signin', input);
        persist(data.accessToken, data.user);
    };
    const signup = async (input) => {
        const { data } = await api.post('/auth/signup', input);
        persist(data.accessToken, data.user);
    };
    const signout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('hostelia:token');
        localStorage.removeItem('hostelia:user');
        setAuthToken(undefined);
    };
    return _jsx(AuthContext.Provider, { value: { user, token, signin, signup, signout }, children: children });
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('AuthContext missing');
    }
    return ctx;
};
