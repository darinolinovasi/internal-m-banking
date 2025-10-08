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

            // save user info to AsyncStorage
            if (response.data?.data?.user) {
                const user = {
                    id: response.data.data.user.id,
                    email: response.data.data.user.email,
                    full_name: response.data.data.user.full_name,
                    role: response.data.data.user.role,
                }

                await AsyncStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (err: any) {
            if (err.response?.status == 400 && err.response?.data?.error == 'invalid credentials') {
                setError('Email atau password salah');
                return;
            }
            setError(err.response?.data?.message || 'Login gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { signIn, loading, error };
}
