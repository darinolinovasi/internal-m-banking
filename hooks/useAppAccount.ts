/**
 * Optimized Account Hook with State Management
 * Replaces the old useAccount hook with better performance and caching
 */

import api from '@/api/api';
import { SECURITY_CONFIG } from '@/config/security';
import { accountActions } from '@/contexts/AppActions';
import { useAppState } from '@/contexts/AppStateContext';
import { CACHE_CONFIGS, CACHE_KEYS, dataCache } from '@/utils/DataCache';
import { SecureStorage } from '@/utils/secureStorage';
import { useCallback } from 'react';

export function useAppAccount() {
    const { state, dispatch } = useAppState();
    const { account, loading, error, lastFetch } = {
        account: state.account,
        loading: state.loading.account,
        error: state.errors.account,
        lastFetch: state.lastFetch.account,
    };

    /**
     * Check if account data is fresh (less than 5 minutes old)
     */
    const isAccountDataFresh = useCallback(() => {
        if (!lastFetch) return false;
        return (Date.now() - lastFetch) < (5 * 60 * 1000); // 5 minutes
    }, [lastFetch]);

    /**
     * Fetch account balance with caching
     */
    const fetchAccountBalance = useCallback(async (accountNo: string, forceRefresh = false) => {
        // Check cache first if not forcing refresh
        if (!forceRefresh && isAccountDataFresh()) {
            return account;
        }

        // Check persistent cache
        if (!forceRefresh) {
            const cachedAccount = await dataCache.get(CACHE_KEYS.ACCOUNT);
            if (cachedAccount) {
                dispatch(accountActions.setAccount(cachedAccount as any));
                return cachedAccount;
            }
        }

        dispatch(accountActions.setAccountLoading(true));
        dispatch(accountActions.setAccountError(null));

        try {
            const bankCardToken = await SecureStorage.getItem('bank_card_token') || SECURITY_CONFIG.BANK_CARD_TOKEN;

            const response = await api.post('/account/balance', {
                accountNo,
                bankCardToken
            });

            const accountData = response.data?.data || null;

            if (accountData) {
                // Update state
                dispatch(accountActions.setAccount(accountData));

                // Cache the data
                await dataCache.set(CACHE_KEYS.ACCOUNT, accountData, CACHE_CONFIGS.ACCOUNT);

                // Update last fetch timestamp
                dispatch(accountActions.setAccountLastFetch(Date.now()));
            }

            return accountData;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch account balance';
            dispatch(accountActions.setAccountError(errorMessage));

            // Check if it's a 401 error (session expired)
            if (err?.response?.status === 401) {
                dispatch({ type: 'SET_SESSION_EXPIRED', payload: true });
            }

            throw err;
        } finally {
            dispatch(accountActions.setAccountLoading(false));
        }
    }, [dispatch, isAccountDataFresh, account]);

    /**
     * Update account balance optimistically
     */
    const updateBalance = useCallback((newBalance: number) => {
        dispatch(accountActions.updateBalance(newBalance));

        // Update cache
        if (account) {
            const updatedAccount = { ...account, balance: newBalance };
            dataCache.set(CACHE_KEYS.ACCOUNT, updatedAccount, CACHE_CONFIGS.ACCOUNT);
        }
    }, [dispatch, account]);

    /**
     * Clear account cache
     */
    const clearAccountCache = useCallback(async () => {
        await dataCache.remove(CACHE_KEYS.ACCOUNT);
        dispatch(accountActions.setAccountLastFetch(0));
    }, [dispatch]);

    /**
     * Refresh account data
     */
    const refreshAccount = useCallback(async (accountNo: string) => {
        await clearAccountCache();
        return fetchAccountBalance(accountNo, true);
    }, [clearAccountCache, fetchAccountBalance]);

    return {
        account,
        loading,
        error,
        lastFetch,
        isAccountDataFresh,
        fetchAccountBalance,
        updateBalance,
        clearAccountCache,
        refreshAccount,
    };
}
