import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TransferByReferenceResponse {
    success: boolean;
    data?: {
        referenceNo: string;
        partnerReferenceNo: string;
        status: string;
        amount: {
            value: string;
            currency: string;
        };
        transactionDate: string;
        beneficiaryAccountNo?: string;
        beneficiaryAccountName?: string;
        beneficiaryBankCode?: string;
        beneficiaryBankName?: string;
        sourceAccountNo?: string;
        remark?: string;
        feeType?: string;
        responseMessage?: string;
        [key: string]: any;
    };
    error?: {
        responseMessage: string;
        [key: string]: any;
    };
}

export function useTransferByReference() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transferData, setTransferData] = useState<any>(null);
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router, t);

    const getTransferByReference = useCallback(async (referenceNo: string): Promise<TransferByReferenceResponse | null> => {
        setLoading(true);
        setError(null);

        // Validate reference number
        if (!referenceNo || referenceNo.trim() === '') {
            const errorMessage = 'Reference number is required';
            setError(errorMessage);
            setLoading(false);
            return null;
        }

        try {
            const response = await api.get(`/account/transfers/${encodeURIComponent(referenceNo)}`);

            if (response.data && response.data.success) {
                setTransferData(response.data.data);
                return response.data;
            } else {
                const errorMessage = response.data?.error?.responseMessage || 'Failed to get transfer details';
                setError(errorMessage);
                return null;
            }
        } catch (err: any) {
            console.log('Get transfer by reference error:', err.response?.data);

            // Extract error message based on API response structure
            const errorData = err?.response?.data?.error;
            let errorMessage = 'Failed to get transfer details';

            if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = errorData.responseMessage || err?.message || 'Failed to get transfer details';
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else {
                errorMessage = err?.message || 'Failed to get transfer details';
            }

            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Get Transfer Details Failed',
                showRetry: true
            });

            return null;
        } finally {
            setLoading(false);
        }
    }, [handleError, t]);

    return {
        getTransferByReference,
        transferData,
        loading,
        error
    };
}

// Raw function for direct API calls without hook state management
export async function rawGetTransferByReference(referenceNo: string): Promise<TransferByReferenceResponse> {
    const response = await api.get(`/account/transfers/${encodeURIComponent(referenceNo)}`);
    return response.data;
}
