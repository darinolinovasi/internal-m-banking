/**
 * Optimized Saved Accounts Hook with State Management
 * Provides saved accounts management with caching
 */

import api from '@/api/api';
import { savedAccountsActions } from '@/contexts/AppActions';
import { useAppState } from '@/contexts/AppStateContext';
import { CACHE_CONFIGS, CACHE_KEYS, dataCache } from '@/utils/DataCache';
import { SecureStorage } from '@/utils/secureStorage';
import { useCallback } from 'react';

export interface SavedAccount {
    id: string;
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
}

export function useAppSavedAccounts() {
    const { state, dispatch } = useAppState();
    const { savedAccounts, loading, error, lastFetch } = state;

    /**
     * Check if saved accounts data is fresh
     */
    const isSavedAccountsDataFresh = useCallback(() => {
        if (!lastFetch) return false;
        return Date.now() - lastFetch < 30 * 60 * 1000; // 30 minutes
    }, [lastFetch]);

    /**
     * Fetch saved accounts with caching
     */
    const fetchSavedAccounts = useCallback(async (forceRefresh = false) => {
        // Check cache first if not forcing refresh
        if (!forceRefresh && isSavedAccountsDataFresh()) {
            return savedAccounts;
        }

        // Check persistent cache
        if (!forceRefresh) {
            const cachedAccounts = await dataCache.get(CACHE_KEYS.SAVED_ACCOUNTS);
            if (cachedAccounts) {
                dispatch(savedAccountsActions.setSavedAccounts(cachedAccounts));
                return cachedAccounts;
            }
        }

        dispatch(savedAccountsActions.setSavedAccountsLoading(true));
        dispatch(savedAccountsActions.setSavedAccountsError(null));

        try {
            const jwt = await SecureStorage.getJWT();

            const response = await api.get('/account/saved-accounts', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const accountsData = response.data?.data || [];

            // Update state
            dispatch(savedAccountsActions.setSavedAccounts(accountsData));

            // Cache the data
            await dataCache.set(CACHE_KEYS.SAVED_ACCOUNTS, accountsData, CACHE_CONFIGS.SAVED_ACCOUNTS);

            // Update last fetch timestamp
            dispatch(savedAccountsActions.setSavedAccountsLastFetch(Date.now()));

            return accountsData;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch saved accounts';
            dispatch(savedAccountsActions.setSavedAccountsError(errorMessage));

            // Check if it's a 401 error (session expired)
            if (err?.response?.status === 401) {
                dispatch({ type: 'SET_SESSION_EXPIRED', payload: true });
            }

            throw err;
        } finally {
            dispatch(savedAccountsActions.setSavedAccountsLoading(false));
        }
    }, [dispatch, isSavedAccountsDataFresh, savedAccounts]);

    /**
     * Add saved account optimistically
     */
    const addSavedAccount = useCallback(async (account: SavedAccount) => {
        // Optimistic update
        const updatedAccounts = [account, ...savedAccounts];
        dispatch(savedAccountsActions.setSavedAccounts(updatedAccounts));

        // Update cache
        await dataCache.set(CACHE_KEYS.SAVED_ACCOUNTS, updatedAccounts, CACHE_CONFIGS.SAVED_ACCOUNTS);

        return account;
    }, [dispatch, savedAccounts]);

    /**
     * Remove saved account
     */
    const removeSavedAccount = useCallback(async (accountId: string) => {
        // Optimistic update
        const updatedAccounts = savedAccounts.filter(account => account.id !== accountId);
        dispatch(savedAccountsActions.setSavedAccounts(updatedAccounts));

        // Update cache
        await dataCache.set(CACHE_KEYS.SAVED_ACCOUNTS, updatedAccounts, CACHE_CONFIGS.SAVED_ACCOUNTS);

        return true;
    }, [dispatch, savedAccounts]);

    /**
     * Save account number
     */
    const saveAccountNumber = useCallback(async (accountData: {
        account_number: string;
        account_name: string;
        bank_code: string;
        bank_name: string;
    }) => {
        try {
            const jwt = await SecureStorage.getJWT();

            const response = await api.post('/account/save-account-number', accountData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const savedAccount = response.data?.data;

            if (savedAccount) {
                await addSavedAccount(savedAccount);
            }

            return savedAccount;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to save account';
            dispatch(savedAccountsActions.setSavedAccountsError(errorMessage));
            throw err;
        }
    }, [dispatch, addSavedAccount]);

    /**
     * Clear saved accounts cache
     */
    const clearSavedAccountsCache = useCallback(async () => {
        await dataCache.remove(CACHE_KEYS.SAVED_ACCOUNTS);
        dispatch(savedAccountsActions.setSavedAccountsLastFetch(null));
    }, [dispatch]);

    /**
     * Refresh saved accounts
     */
    const refreshSavedAccounts = useCallback(async () => {
        await clearSavedAccountsCache();
        return fetchSavedAccounts(true);
    }, [clearSavedAccountsCache, fetchSavedAccounts]);

    /**
     * Find saved account by number
     */
    const findSavedAccount = useCallback((accountNumber: string) => {
        return savedAccounts.find(account => account.account_number === accountNumber);
    }, [savedAccounts]);

    /**
     * Check if account is saved
     */
    const isAccountSaved = useCallback((accountNumber: string) => {
        return savedAccounts.some(account => account.account_number === accountNumber);
    }, [savedAccounts]);

    return {
        savedAccounts,
        loading,
        error,
        lastFetch,
        isSavedAccountsDataFresh,
        fetchSavedAccounts,
        addSavedAccount,
        removeSavedAccount,
        saveAccountNumber,
        clearSavedAccountsCache,
        refreshSavedAccounts,
        findSavedAccount,
        isAccountSaved,
    };
}
