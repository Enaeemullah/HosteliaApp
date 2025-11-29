import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { Hostel } from '../types';
import { useAuth } from './AuthContext';

type HostelsContextValue = {
  hostels: Hostel[];
  loading: boolean;
  refetch: () => Promise<void>;
};

const HostelsContext = createContext<HostelsContextValue | undefined>(undefined);

export const HostelsProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHostels = useCallback(async () => {
    if (!token) {
      setHostels([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get<Hostel[]>('/hostels');
      setHostels(data);
    } catch (error) {
      console.error('Failed to load hostels', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchHostels();
    } else {
      setHostels([]);
      setLoading(false);
    }
  }, [token, fetchHostels]);

  const value = useMemo(
    () => ({
      hostels,
      loading,
      refetch: fetchHostels,
    }),
    [hostels, loading, fetchHostels],
  );

  return <HostelsContext.Provider value={value}>{children}</HostelsContext.Provider>;
};

export const useHostelsContext = () => {
  const ctx = useContext(HostelsContext);
  if (!ctx) {
    throw new Error('HostelsContext missing');
  }
  return ctx;
};
