import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useLogout() {
    const { showError } = useError()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { t } = useTranslation()

    const handleError = createErrorHandler(showError, router, t)

    const logout = async () => {
        setLoading(true);
        const jwt = await SecureStorage.getJWT();
        if (!jwt) {
            setLoading(false);
            return;
        }
        try {
            await api.post('/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization header will be added by interceptor if jwt exists
                    'Authorization': `Bearer ${jwt}`
                },
            });
            await SecureStorage.logout();
            setLoading(false);
        } catch (err: any) {
            // Optionally handle error
            console.log('Logout error:', err);
            setError(err)
            setLoading(false);

            handleError(err, {
                title: "Logout Gagal",
                showRetry: false
            })
        }
    };
    return { logout, loading, error };
}