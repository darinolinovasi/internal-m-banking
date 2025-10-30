import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { validateEmail, validatePasswordStrength } from '@/utils/inputValidation';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useSignIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const router = useRouter();
    const { t } = useTranslation();
    const handleError = createErrorHandler(showError, router, t);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        // Validate input
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error || 'Invalid email');
            setLoading(false);
            return;
        }

        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.error || 'Invalid password');
            setLoading(false);
            return;
        }

        try {
            console.log(api.getUri())
            const response = await api.post('/auth/login', { email, password });

            // Save JWT securely
            if (response.data?.data?.jwt) {
                await SecureStorage.setJWT(response.data.data.jwt);
            }

            // Save refresh_token securely
            if (response.data?.data?.refresh_token) {
                await SecureStorage.setRefreshToken(response.data.data.refresh_token);
            }

            // Save user info (non-sensitive)
            if (response.data?.data?.user) {
                const user = {
                    id: response.data.data.user.id,
                    email: response.data.data.user.email,
                    full_name: response.data.data.user.full_name,
                    role: response.data.data.user.role,
                }

                await SecureStorage.setUserInfo(user);
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
