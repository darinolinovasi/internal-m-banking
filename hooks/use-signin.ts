import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useSignIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router);

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
            // Handle specific login errors
            const errorData = err.response?.data?.error;
            const errorMessage = typeof errorData === 'object'
                ? errorData?.responseMessage
                : errorData;

            if (err.response?.status === 400 && errorMessage === 'invalid credentials') {
                const userMessage = 'Email atau password salah';
                setError(userMessage);
                showError(userMessage, { title: 'Login Gagal' });
                return;
            }

            // Use the new error handler for other errors
            handleError(err, {
                title: 'Login Gagal',
                showRetry: true
            });
            const fallbackMessage = err.response?.data?.message || 'Login gagal';
            setError(fallbackMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { signIn, loading, error };
}
