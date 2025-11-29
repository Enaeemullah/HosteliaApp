import { useEffect, useState } from 'react';
import api from '../api/client';
import { Hostel } from '../types';

export const useHostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Hostel[]>('/hostels');
      setHostels(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return { hostels, loading, refetch: fetchHostels };
};
