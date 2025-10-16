import api from '@/api/api';
import { SECURITY_CONFIG } from '@/config/security';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { validateAccountNumber } from '@/utils/inputValidation';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useInquiry() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router);

    const inquiry = async (bank: { bank_code: string }, accountNumber: string) => {
        setLoading(true);
        setError(null);

        // Validate account number
        const accountValidation = validateAccountNumber(accountNumber);
        if (!accountValidation.isValid) {
            setError(accountValidation.error || 'Invalid account number');
            setLoading(false);
            return;
        }

        try {
            let endpoint = bank.bank_code === '002' ? '/intrabank/inquiry' : '/interbank/inquiry';
            let requestBody;
            if (bank.bank_code === '002') {
                requestBody = {
                    beneficiaryAccountNo: accountNumber,
                    additionalInfo: {
                        deviceId: SECURITY_CONFIG.DEVICE_ID,
                        channel: SECURITY_CONFIG.CHANNEL,
                    },
                };
            } else {
                requestBody = {
                    beneficiaryBankCode: bank.bank_code,
                    beneficiaryAccountNo: accountNumber,
                    additionalInfo: {
                        deviceId: SECURITY_CONFIG.DEVICE_ID,
                        channel: SECURITY_CONFIG.CHANNEL,
                    },
                };
            }
            const jwt = await SecureStorage.getJWT();
            const response = await api.post(endpoint, requestBody, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response;
        } catch (err: any) {
            let errorMessage = 'Terjadi Kesalahan.';

            if (!err.response || !err.response.data) {
                errorMessage = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
            } else {
                // Extract error message based on API response structure
                const errorData = err.response.data.error;
                let responseMessage = '';

                if (typeof errorData === 'object' && errorData !== null) {
                    responseMessage = errorData.responseMessage || '';
                } else if (typeof errorData === 'string') {
                    responseMessage = errorData;
                }

                if ((err.response.status === 403 || err.response.status === 400) && responseMessage) {
                    const msg = responseMessage.toLowerCase();
                    if (msg.includes('inactive') || msg.includes('invalid') || msg.includes('not found')) {
                        errorMessage = 'Nomor rekening tidak valid. Periksa kembali?';
                    }
                }
            }

            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Validasi Rekening Gagal',
                showRetry: true
                // Note: Don't override shouldRedirectToSignin - let the error handler decide
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { inquiry, loading, error };
}
