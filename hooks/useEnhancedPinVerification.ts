/**
 * Enhanced PIN Verification Hook
 * Simplified version without attempt tracking
 */

import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

export function useEnhancedPinVerification() {
    const [showInvalidPinModal, setShowInvalidPinModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();
    const { showError } = useError();

    // Simple session expired handler without using useAppAuth hook
    const handleSessionExpired = useCallback(async () => {
        await SecureStorage.logout();
        router.replace('/signin');
    }, [router]);

    /**
     * Verify PIN with enhanced error handling (simplified)
     */
    const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
        setIsVerifying(true);

        try {
            const jwt = await SecureStorage.getJWT();
            const response = await api.post(
                '/auth/verify-pin',
                { pin },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );

            if (response.status === 200) {
                return true;
            }

            return false;
        } catch (err: any) {
            // Handle session expiration
            if (err?.response?.status === 401 && err.response?.data?.error !== 'Invalid PIN') {
                await handleSessionExpired();
                return false;
            }

            // Handle invalid PIN
            if (err?.response?.status === 401 && err.response?.data?.error === 'Invalid PIN') {
                setShowInvalidPinModal(true);
                return false;
            }

            // Handle other errors
            showError('PIN verification failed. Please try again.');
            return false;
        } finally {
            setIsVerifying(false);
        }
    }, [handleSessionExpired, showError]);

    /**
     * Handle forgot PIN action
     */
    const handleForgotPin = useCallback(() => {
        setShowInvalidPinModal(false);
        // Navigate to forgot PIN flow or contact support
        showError('Please contact customer support for PIN recovery assistance.');
    }, [showError]);

    /**
     * Close invalid PIN modal
     */
    const closeInvalidPinModal = useCallback(() => {
        setShowInvalidPinModal(false);
    }, []);

    return {
        // State
        isVerifying,
        showInvalidPinModal,

        // Actions
        verifyPin,
        handleForgotPin,
        closeInvalidPinModal,
    };
}
