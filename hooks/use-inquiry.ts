import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        try {
            let endpoint = bank.bank_code === '002' ? '/intrabank/inquiry' : '/interbank/inquiry';
            let requestBody;
            if (bank.bank_code === '002') {
                requestBody = {
                    beneficiaryAccountNo: accountNumber,
                    additionalInfo: {
                        deviceId: '12345679237',
                        channel: 'mobilephone',
                    },
                };
            } else {
                requestBody = {
                    beneficiaryBankCode: bank.bank_code,
                    beneficiaryAccountNo: accountNumber,
                    additionalInfo: {
                        deviceId: '12345679237',
                        channel: 'mobilephone',
                    },
                };
            }
            const jwt = await AsyncStorage.getItem('jwt');
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
