import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useUpdatePin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const updatePin = async (pin: string, confirm_pin: string) => {
        setLoading(true);
        setError(null);
        try {
            const jwt = await AsyncStorage.getItem('jwt');
            const response = await api.post(
                '/auth/update-pin',
                { pin, confirm_pin },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            setData(response.data);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal membuat PIN');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updatePin, loading, error };
}
