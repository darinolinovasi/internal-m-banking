import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TransferStatusParams {
    originalPartnerReferenceNo: string;
    originalReferenceNo: string;
    originalExternalId: string;
    serviceCode: string;
    transactionDate: string;
    amount: {
        value: string;
        currency: string;
    };
    additionalInfo: {
        deviceId: string;
        channel: string;
    };
}

export interface TransferStatusResponse {
    success: boolean;
    data?: {
        status: string;
        referenceNo?: string;
        partnerReferenceNo?: string;
        amount?: {
            value: string;
            currency: string;
        };
        transactionDate?: string;
        responseMessage?: string;
        [key: string]: any;
    };
    error?: {
        responseMessage: string;
        [key: string]: any;
    };
}

export function useTransferStatus() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router, t);

    const checkTransferStatus = useCallback(async (params: TransferStatusParams): Promise<TransferStatusResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/transfer/status', params);

            if (response.data && response.data.success) {
                return response.data;
            } else {
                const errorMessage = response.data?.error?.responseMessage || 'Failed to check transfer status';
                setError(errorMessage);
                return null;
            }
        } catch (err: any) {
            console.log('Transfer status check error:', err.response?.data);

            // Extract error message based on API response structure
            const errorData = err?.response?.data?.error;
            let errorMessage = 'Failed to check transfer status';

            if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = errorData.responseMessage || err?.message || 'Failed to check transfer status';
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else {
                errorMessage = err?.message || 'Failed to check transfer status';
            }

            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Transfer Status Check Failed',
                showRetry: true
            });

            return null;
        } finally {
            setLoading(false);
        }
    }, [handleError, t]);

    return {
        checkTransferStatus,
        loading,
        error
    };
}

// Raw function for direct API calls without hook state management
export async function rawCheckTransferStatus(params: TransferStatusParams): Promise<TransferStatusResponse> {
    const response = await api.post('/transfer/status', params);
    return response.data;
}
