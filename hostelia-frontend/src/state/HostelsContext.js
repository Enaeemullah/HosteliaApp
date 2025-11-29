import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
const HostelsContext = createContext(undefined);
export const HostelsProvider = ({ children }) => {
    const { token } = useAuth();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchHostels = useCallback(async () => {
        if (!token) {
            setHostels([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get('/hostels');
            setHostels(data);
        }
        catch (error) {
            console.error('Failed to load hostels', error);
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    useEffect(() => {
        if (token) {
            fetchHostels();
        }
        else {
            setHostels([]);
            setLoading(false);
        }
    }, [token, fetchHostels]);
    const value = useMemo(() => ({
        hostels,
        loading,
        refetch: fetchHostels,
    }), [hostels, loading, fetchHostels]);
    return _jsx(HostelsContext.Provider, { value: value, children: children });
};
export const useHostelsContext = () => {
    const ctx = useContext(HostelsContext);
    if (!ctx) {
        throw new Error('HostelsContext missing');
    }
    return ctx;
};
