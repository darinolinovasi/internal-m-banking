import api from '@/api/api';
import { SECURITY_CONFIG } from '@/config/security';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { validateAccountNumber, validateAmount } from '@/utils/inputValidation';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TransferToAccountParams {
    account: any;
    amount: string;
    note: string;
    sourceAccountNo: string;
    partnerReferenceNo: string;
    customerReference: string;
    originatorCustomerNo?: string;
    originatorCustomerName?: string;
    originatorBankCode?: string;
    beneficiaryAddress?: string;
    beneficiaryEmail?: string;
    transactionDate: string;
    internalData?: {
        recipientAccountID: number;
        recipientAccountType: string;
        recipientName: string;
        bankID: number;
        TransferType: string;
        TransactionType: string;
    };
}

export function useTransfer() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router);

    const transferToAccount = async (params: TransferToAccountParams) => {
        setLoading(true);
        setError(null);

        // Validate input
        const amountValidation = validateAmount(params.amount);
        if (!amountValidation.isValid) {
            setError(amountValidation.error || 'Invalid amount');
            setLoading(false);
            return;
        }

        if (params.account?.account_number) {
            const accountValidation = validateAccountNumber(params.account.account_number);
            if (!accountValidation.isValid) {
                setError(accountValidation.error || 'Invalid account number');
                setLoading(false);
                return;
            }
        }

        try {
            const result = await rawTransferToAccount(params);
            return result;
        } catch (err: any) {
            console.log(err.response.data);

            // Extract error message based on API response structure
            const errorData = err?.response?.data?.error;
            let errorMessage = 'Transfer gagal';

            if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = errorData.responseMessage || err?.message || 'Transfer gagal';
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else {
                errorMessage = err?.message || 'Transfer gagal';
            }

            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Transfer Gagal',
                showRetry: true
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { transferToAccount, loading, error };
}

export async function rawTransferToAccount(params: TransferToAccountParams) {
    const { account, amount, note, sourceAccountNo, partnerReferenceNo, customerReference, originatorCustomerNo = '', originatorCustomerName = '', originatorBankCode = '', beneficiaryAddress = 'Palembang', beneficiaryEmail = '', transactionDate } = params;
    if (!account || !account.bank || !account.account_number) {
        throw new Error('Invalid account data');
    }
    const value = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : Number(amount);
    const jwt = await SecureStorage.getJWT();
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    // Convert transactionDate to ISO format with timezone +07:00
    function toISOWithTimezone(date: string | Date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        // Pad to 2 digits
        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const min = pad(d.getMinutes());
        const sec = pad(d.getSeconds());
        // Always use +07:00 as requested
        return `${year}-${month}-${day}T${hour}:${min}:${sec}+07:00`;
    }

    if (account.bank.bank_code === '002') {
        // Intrabank transfer
        const body = {
            partnerReferenceNo,
            amount: {
                value: value.toFixed(2),
                currency: 'IDR',
            },
            beneficiaryAccountNo: account.account_number,
            customerReference,
            feeType: 'BEN',
            originatorInfos: [
                {
                    originatorCustomerNo,
                    originatorCustomerName,
                    originatorBankCode,
                },
            ],
            remark: note,
            sourceAccountNo,
            transactionDate: toISOWithTimezone(transactionDate),
            additionalInfo: {},
            internalData: params.internalData
        };
        return api.post('/intrabank/transfer', body, { headers });
    } else {
        // Interbank transfer - use the exact structure as requested
        const body = {
            partnerReferenceNo,
            amount: {
                value: value.toFixed(2),
                currency: 'IDR',
            },
            beneficiaryAccountName: account.account_holder_name,
            beneficiaryAccountNo: account.account_number,
            beneficiaryAddress,
            beneficiaryBankCode: account.bank.bank_code,
            beneficiaryBankName: account.bank.bank_name,
            beneficiaryEmail,
            customerReference,
            sourceAccountNo,
            transactionDate: toISOWithTimezone(transactionDate),
            additionalInfo: {
                deviceId: SECURITY_CONFIG.DEVICE_ID,
                channel: SECURITY_CONFIG.CHANNEL,
            },
            remark: note,
            internalData: params.internalData
        };
        return api.post('/interbank/transfer', body, { headers });
    }
}

export async function fetchTransfersWithTransactions({ limit = 7, offset = 0 } = {}) {
    try {
        const response = await api.get('/account/transfers', { params: { limit, offset } });
        if (response.data && response.data.success) {
            return {
                transfers: response.data.data?.data || [],
                total: response.data.data?.total || 0,
                limit: response.data.data?.limit || limit,
                offset: response.data.data?.offset || offset,
            };
        }
        return { transfers: [], total: 0, limit, offset };
    } catch (error: any) {
        console.log("ERROR:")
        console.log(error.response.data)
        console.error('Failed to fetch transfers:', error);
        return { transfers: [], total: 0, limit, offset };
    }
}

export function useTransfersWithTransactions() {
    const { t } = useTranslation();
    const [transfers, setTransfers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router);

    const fetchTransfers = useCallback(async (reset = false) => {
        setLoading(true);
        setError(null);
        try {
            const pageOffset = reset ? 0 : offset;
            const result = await fetchTransfersWithTransactions({ limit, offset: pageOffset });
            if (reset) {
                setTransfers(result.transfers);
            } else {
                setTransfers(prev => [...prev, ...result.transfers]);
            }
            setOffset(pageOffset + limit);
            setHasMore(result.transfers.length === limit);
        } catch (err: any) {
            console.log("ERROR:")
            console.log(err.response.data);

            // Extract error message based on API response structure
            const errorData = err?.response?.data?.error;
            let errorMessage = t('failed_fetch_transfer');

            if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = errorData.responseMessage || err?.message || t('failed_fetch_transfer');
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else {
                errorMessage = err?.message || t('failed_fetch_transfer');
            }

            setError(errorMessage);

            // Show error modal with retry option
            handleError(err, {
                title: 'Gagal Memuat Data',
                showRetry: true
            });
        } finally {
            setLoading(false);
        }
    }, [offset]);

    // Initial load
    useEffect(() => {
        fetchTransfers(true);
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchTransfers();
        }
    }, [loading, hasMore, fetchTransfers]);

    const refetch = useCallback(() => {
        setOffset(0);
        setHasMore(true);
        fetchTransfers(true);
    }, [fetchTransfers]);

    return { transfers, loading, error, refetch, loadMore, hasMore };
}
