import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useVerifyPin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyPin = async (pin: string) => {
        setLoading(true);
        setError(null);
        try {
            const jwt = await AsyncStorage.getItem('jwt');
            const response = await api.post(
                '/auth/verify-pin',
                { pin },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'PIN yang Anda masukkan salah.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { verifyPin, loading, error };
}
