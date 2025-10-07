import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useSavedAccounts() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const jwt = await AsyncStorage.getItem('jwt');
            const response = await api.get('/account/saved-accounts', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setAccounts(response.data.data || []);
            setStatusCode(response.status);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memuat rekening tersimpan.');
            setStatusCode(err.response?.status || null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return { accounts, loading, error, refetch: fetchAccounts, statusCode };
}
