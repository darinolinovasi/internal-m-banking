/**
 * Optimized Transactions Hook with State Management
 * Provides transaction management with caching and optimistic updates
 */

import api from '@/api/api';
import { SECURITY_CONFIG } from '@/config/security';
import { transactionActions } from '@/contexts/AppActions';
import { useAppState } from '@/contexts/AppStateContext';
import { CACHE_CONFIGS, CACHE_KEYS, dataCache } from '@/utils/DataCache';
import { SecureStorage } from '@/utils/secureStorage';
import { useCallback } from 'react';

export interface TransactionParams {
    limit?: number;
    offset?: number;
    accountNo?: string;
    startDate?: string;
    endDate?: string;
}

export function useAppTransactions() {
    const { state, dispatch } = useAppState();
    const { transactions, recentTransactions, loading, error, lastFetch } = state;

    /**
     * Check if transaction data is fresh
     */
    const isTransactionDataFresh = useCallback(() => {
        if (!lastFetch) return false;
        return Date.now() - lastFetch < 10 * 60 * 1000; // 10 minutes
    }, [lastFetch]);

    /**
     * Fetch transactions with caching
     */
    const fetchTransactions = useCallback(async (params: TransactionParams = {}, forceRefresh = false) => {
        // Check cache first if not forcing refresh
        if (!forceRefresh && isTransactionDataFresh()) {
            return transactions;
        }

        // Check persistent cache
        if (!forceRefresh) {
            const cachedTransactions = await dataCache.get(CACHE_KEYS.TRANSACTIONS);
            if (cachedTransactions) {
                dispatch(transactionActions.setTransactions(cachedTransactions));
                return cachedTransactions;
            }
        }

        dispatch(transactionActions.setTransactionsLoading(true));
        dispatch(transactionActions.setTransactionsError(null));

        try {
            const jwt = await SecureStorage.getJWT();
            const bankCardToken = await SecureStorage.getItem('bank_card_token') || SECURITY_CONFIG.BANK_CARD_TOKEN;
            const accountNo = params.accountNo || '2000100101';

            const response = await api.post('/account/transactions', {
                accountNo,
                bankCardToken,
                limit: params.limit || 20,
                offset: params.offset || 0,
                startDate: params.startDate,
                endDate: params.endDate,
            }, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const transactionData = response.data?.data || [];

            // Update state
            dispatch(transactionActions.setTransactions(transactionData));

            // Cache the data
            await dataCache.set(CACHE_KEYS.TRANSACTIONS, transactionData, CACHE_CONFIGS.TRANSACTIONS);

            // Update last fetch timestamp
            dispatch(transactionActions.setTransactionsLastFetch(Date.now()));

            return transactionData;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch transactions';
            dispatch(transactionActions.setTransactionsError(errorMessage));

            // Check if it's a 401 error (session expired)
            if (err?.response?.status === 401) {
                dispatch({ type: 'SET_SESSION_EXPIRED', payload: true });
            }

            throw err;
        } finally {
            dispatch(transactionActions.setTransactionsLoading(false));
        }
    }, [dispatch, isTransactionDataFresh, transactions]);

    /**
     * Add transaction optimistically
     */
    const addTransaction = useCallback((transaction: any) => {
        dispatch(transactionActions.addTransaction(transaction));

        // Update cache
        const updatedTransactions = [transaction, ...transactions];
        dataCache.set(CACHE_KEYS.TRANSACTIONS, updatedTransactions, CACHE_CONFIGS.TRANSACTIONS);
    }, [dispatch, transactions]);

    /**
     * Fetch recent transactions (last 5)
     */
    const fetchRecentTransactions = useCallback(async (accountNo: string = '2000100101') => {
        try {
            const recentData = await fetchTransactions({
                accountNo,
                limit: 5,
                offset: 0
            });

            dispatch(transactionActions.setRecentTransactions(recentData.slice(0, 5)));
            return recentData.slice(0, 5);
        } catch (error) {
            console.error('Failed to fetch recent transactions:', error);
            throw error;
        }
    }, [dispatch, fetchTransactions]);

    /**
     * Clear transaction cache
     */
    const clearTransactionCache = useCallback(async () => {
        await dataCache.remove(CACHE_KEYS.TRANSACTIONS);
        dispatch(transactionActions.setTransactionsLastFetch(null));
    }, [dispatch]);

    /**
     * Refresh transactions
     */
    const refreshTransactions = useCallback(async (params: TransactionParams = {}) => {
        await clearTransactionCache();
        return fetchTransactions(params, true);
    }, [clearTransactionCache, fetchTransactions]);

    /**
     * Get transactions by date range
     */
    const getTransactionsByDateRange = useCallback(async (
        startDate: string,
        endDate: string,
        accountNo: string = '2000100101'
    ) => {
        return fetchTransactions({
            accountNo,
            startDate,
            endDate,
            limit: 50,
        });
    }, [fetchTransactions]);

    return {
        transactions,
        recentTransactions,
        loading,
        error,
        lastFetch,
        isTransactionDataFresh,
        fetchTransactions,
        addTransaction,
        fetchRecentTransactions,
        clearTransactionCache,
        refreshTransactions,
        getTransactionsByDateRange,
    };
}
