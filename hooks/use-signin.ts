import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useSignIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            setData(response.data);
            // Save JWT to AsyncStorage
            if (response.data?.data?.jwt) {
                await AsyncStorage.setItem('jwt', response.data.data.jwt);
            }
            // Save refresh_token to AsyncStorage
            if (response.data?.data?.refresh_token) {
                await AsyncStorage.setItem('refresh_token', response.data.data.refresh_token);
            }
            console.log('Login successful:', response.data);
            return response.data;
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { signIn, loading, error };
}
