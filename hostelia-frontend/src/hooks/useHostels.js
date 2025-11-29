import { useEffect, useState } from 'react';
import api from '../api/client';
export const useHostels = () => {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchHostels = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/hostels');
            setHostels(data);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchHostels();
    }, []);
    return { hostels, loading, refetch: fetchHostels };
};
