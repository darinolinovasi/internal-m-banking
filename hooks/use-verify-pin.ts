import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useVerifyPin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const router = useRouter();
    const { t } = useTranslation();
    const handleError = createErrorHandler(showError, router, t);

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
            console.log(err);
            const errorMessage = err.response?.data?.message || 'PIN yang Anda masukkan salah.';
            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Verifikasi PIN Gagal',
                showRetry: true
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { verifyPin, loading, error };
}
