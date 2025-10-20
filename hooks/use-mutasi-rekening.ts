import api from '@/api/api';
import { SECURITY_CONFIG } from '@/config/security';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface MutasiTransaction {
    detailBalance: {
        startAmount: Array<{
            amount: {
                value: string;
                currency: string;
            };
        }>;
        endAmount: Array<{
            amount: {
                value: string;
                currency: string;
            };
        }>;
    };
    amount: {
        value: string;
        currency: string;
    };
    transactionDate: string;
    remark: string;
    transactionId: string;
    type: 'Credit' | 'Debit';
    detailInfo: {
        remarkCustom: string;
    };
}

export interface MutasiSummary {
    totalCreditEntries: {
        numberOfEntries: string;
        amount: {
            value: string;
            currency: string;
        };
    };
    totalDebitEntries: {
        numberOfEntries: string;
        amount: {
            value: string;
            currency: string;
        };
    };
}

export interface MutasiApiResponse {
    responseCode: string;
    responseMessage: string;
    referenceNo: string;
    totalCreditEntries: {
        numberOfEntries: string;
        amount: {
            value: string;
            currency: string;
        };
    };
    totalDebitEntries: {
        numberOfEntries: string;
        amount: {
            value: string;
            currency: string;
        };
    };
    detailData: MutasiTransaction[];
}

export interface MutasiFilters {
    fromDateTime?: Date;
    toDateTime?: Date;
}

export interface MutasiResponse {
    transactions: MutasiTransaction[];
    summary: MutasiSummary;
    referenceNo: string;
    responseCode: string;
    responseMessage: string;
}

export function useMutasiRekening() {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<MutasiTransaction[]>([]);
    const [summary, setSummary] = useState<MutasiSummary | null>(null);
    const [referenceNo, setReferenceNo] = useState<string>('');
    const [responseCode, setResponseCode] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const router = useRouter();
    const handleError = useCallback(
        (error: any, customOptions?: any) => {
            const errorHandler = createErrorHandler(showError, router, t);
            return errorHandler(error, customOptions);
        },
        [showError, router, t]
    );

    const fetchMutasi = useCallback(async (filters?: MutasiFilters) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchMutasiTransactions({ filters });
            setTransactions(result.transactions);
            setSummary(result.summary);
            setReferenceNo(result.referenceNo);
            setResponseCode(result.responseCode);
            setResponseMessage(result.responseMessage);
        } catch (err: any) {
            console.error('Failed to fetch mutasi:', err);

            // Handle 401 errors via the error handler first (will redirect to signin)
            handleError(err, {
                title: t('failed_fetch_mutasi'),
                showRetry: err?.response?.status !== 401 // Don't show retry for 401 errors
            });

            // Only set local error state for non-401 errors to avoid mapping issues
            if (err?.response?.status !== 401) {
                const errorMessage = err?.response?.data?.error || err?.message || t('failed_fetch_mutasi');
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [handleError, t]);

    const fetchByDateRange = useCallback((fromDateTime?: Date, toDateTime?: Date) => {
        fetchMutasi({ fromDateTime, toDateTime });
    }, [fetchMutasi]);

    const refetch = useCallback(() => {
        fetchMutasi();
    }, [fetchMutasi]);

    return {
        transactions,
        summary,
        referenceNo,
        responseCode,
        responseMessage,
        loading,
        error,
        fetchMutasi,
        fetchByDateRange,
        refetch,
    };
}

export async function fetchMutasiTransactions({
    filters = {},
}: {
    filters?: MutasiFilters;
}): Promise<MutasiResponse> {
    try {
        const jwt = await SecureStorage.getJWT();
        const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

        // Generate partner reference number (timestamp-based)
        const partnerReferenceNo = `MUTASI${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        // Get bank card token from secure storage
        const bankCardToken = await SecureStorage.getItem('bank_card_token') || SECURITY_CONFIG.BANK_CARD_TOKEN;

        // Get account number from storage
        const accountNo = await SecureStorage.getItem('account_number') || '2000200202';

        // Build request body according to the provided JSON structure
        const requestBody: any = {
            partnerReferenceNo,
            bankCardToken,
            accountNo,
            additionalInfo: {
                deviceId: SECURITY_CONFIG.DEVICE_ID,
                channel: SECURITY_CONFIG.CHANNEL
            }
        };

        // Add date filters
        if (filters.fromDateTime) {
            // Convert to ISO format with timezone +07:00
            // requestBody.fromDateTime = filters.fromDateTime.toISOString().replace('Z', '+07:00');
            requestBody.fromDateTime = "2019-07-03T12:08:56+07:00";
        }
        if (filters.toDateTime) {
            // Convert to ISO format with timezone +07:00
            requestBody.toDateTime = "2019-07-03T12:08:56+07:00";
        }

        const response = await api.post('/account/bank-statement', requestBody, { headers });

        if (response.data && response.data.success) {
            const data: MutasiApiResponse = response.data.data;
            return {
                transactions: data?.detailData || [],
                summary: {
                    totalCreditEntries: data?.totalCreditEntries,
                    totalDebitEntries: data?.totalDebitEntries,
                },
                referenceNo: data?.referenceNo || '',
                responseCode: data?.responseCode || '',
                responseMessage: data?.responseMessage || '',
            };
        }

        return {
            transactions: [],
            summary: {
                totalCreditEntries: { numberOfEntries: '0', amount: { value: '0.00', currency: 'IDR' } },
                totalDebitEntries: { numberOfEntries: '0', amount: { value: '0.00', currency: 'IDR' } },
            },
            referenceNo: '',
            responseCode: '',
            responseMessage: '',
        };
    } catch (error: any) {
        console.error('Failed to fetch mutasi transactions:', error);
        throw error;
    }
}

export async function fetchMutasiTransactionDetail(transactionId: string) {
    try {
        const jwt = await SecureStorage.getJWT();
        const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

        // Generate partner reference number for detail request
        const partnerReferenceNo = `DETAIL${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        // Get bank card token from secure storage
        const bankCardToken = await SecureStorage.getItem('bank_card_token') || SECURITY_CONFIG.BANK_CARD_TOKEN;

        // Get account number from storage
        const accountNo = await SecureStorage.getItem('account_number') || '2000200202';

        const requestBody = {
            partnerReferenceNo,
            bankCardToken,
            accountNo,
            transactionId,
            additionalInfo: {
                deviceId: SECURITY_CONFIG.DEVICE_ID,
                channel: SECURITY_CONFIG.CHANNEL
            }
        };

        const response = await api.post(`/account/bank-statement/detail`, requestBody, { headers });

        if (response.data && response.data.success) {
            return response.data.data;
        }

        throw new Error('Failed to fetch transaction detail');
    } catch (error: any) {
        console.error('Failed to fetch transaction detail:', error);
        throw error;
    }
}

export function useMutasiTransactionDetail() {
    const { t } = useTranslation();
    const [transaction, setTransaction] = useState<MutasiTransaction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const handleError = createErrorHandler(showError, undefined, t);

    const fetchDetail = useCallback(async (transactionId: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchMutasiTransactionDetail(transactionId);
            setTransaction(result);
            return result;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.message || 'Gagal mengambil detail transaksi';
            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Gagal Memuat Detail',
                showRetry: true
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { transaction, loading, error, fetchDetail };
}
