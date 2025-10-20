/**
 * Action Creators for App State Management
 * Centralized action creators for better maintainability
 */

import { Account, AppAction, SavedAccount, Transaction, User } from './AppStateContext';

// Authentication Actions
export const authActions = {
    setUser: (user: User | null): AppAction => ({
        type: 'SET_USER',
        payload: user,
    }),

    setAuthenticated: (isAuthenticated: boolean): AppAction => ({
        type: 'SET_AUTHENTICATED',
        payload: isAuthenticated,
    }),

    setSessionExpired: (expired: boolean): AppAction => ({
        type: 'SET_SESSION_EXPIRED',
        payload: expired,
    }),

    setAuthLoading: (loading: boolean): AppAction => ({
        type: 'SET_LOADING',
        payload: { key: 'auth', value: loading },
    }),

    setAuthError: (error: string | null): AppAction => ({
        type: 'SET_ERROR',
        payload: { key: 'auth', value: error },
    }),
};

// Account Actions
export const accountActions = {
    setAccount: (account: Account | null): AppAction => ({
        type: 'SET_ACCOUNT',
        payload: account,
    }),

    updateBalance: (balance: number): AppAction => ({
        type: 'UPDATE_ACCOUNT_BALANCE',
        payload: balance,
    }),

    setAccountLoading: (loading: boolean): AppAction => ({
        type: 'SET_LOADING',
        payload: { key: 'account', value: loading },
    }),

    setAccountError: (error: string | null): AppAction => ({
        type: 'SET_ERROR',
        payload: { key: 'account', value: error },
    }),

    setAccountLastFetch: (timestamp: number): AppAction => ({
        type: 'SET_LAST_FETCH',
        payload: { key: 'account', value: timestamp },
    }),
};

// Saved Accounts Actions
export const savedAccountsActions = {
    setSavedAccounts: (accounts: SavedAccount[]): AppAction => ({
        type: 'SET_SAVED_ACCOUNTS',
        payload: accounts,
    }),

    addSavedAccount: (account: SavedAccount): AppAction => ({
        type: 'SET_SAVED_ACCOUNTS',
        payload: [account, ...[]], // Will be handled by reducer
    }),

    removeSavedAccount: (accountId: string): AppAction => ({
        type: 'SET_SAVED_ACCOUNTS',
        payload: [], // Will be handled by reducer
    }),

    setSavedAccountsLoading: (loading: boolean): AppAction => ({
        type: 'SET_LOADING',
        payload: { key: 'savedAccounts', value: loading },
    }),

    setSavedAccountsError: (error: string | null): AppAction => ({
        type: 'SET_ERROR',
        payload: { key: 'savedAccounts', value: error },
    }),

    setSavedAccountsLastFetch: (timestamp: number): AppAction => ({
        type: 'SET_LAST_FETCH',
        payload: { key: 'savedAccounts', value: timestamp },
    }),
};

// Transaction Actions
export const transactionActions = {
    setTransactions: (transactions: Transaction[]): AppAction => ({
        type: 'SET_TRANSACTIONS',
        payload: transactions,
    }),

    addTransaction: (transaction: Transaction): AppAction => ({
        type: 'ADD_TRANSACTION',
        payload: transaction,
    }),

    setRecentTransactions: (transactions: Transaction[]): AppAction => ({
        type: 'SET_RECENT_TRANSACTIONS',
        payload: transactions,
    }),

    setTransactionsLoading: (loading: boolean): AppAction => ({
        type: 'SET_LOADING',
        payload: { key: 'transactions', value: loading },
    }),

    setTransactionsError: (error: string | null): AppAction => ({
        type: 'SET_ERROR',
        payload: { key: 'transactions', value: error },
    }),

    setTransactionsLastFetch: (timestamp: number): AppAction => ({
        type: 'SET_LAST_FETCH',
        payload: { key: 'transactions', value: timestamp },
    }),
};

// Cache Actions
export const cacheActions = {
    clearCache: (): AppAction => ({
        type: 'CLEAR_CACHE',
    }),

    clearAccountCache: (): AppAction => ({
        type: 'SET_LAST_FETCH',
        payload: { key: 'account', value: 0 },
    }),

    clearTransactionsCache: (): AppAction => ({
        type: 'SET_LAST_FETCH',
        payload: { key: 'transactions', value: 0 },
    }),

    clearSavedAccountsCache: (): AppAction => ({
        type: 'SET_LAST_FETCH',
        payload: { key: 'savedAccounts', value: 0 },
    }),
};

// Reset Actions
export const resetActions = {
    resetState: (): AppAction => ({
        type: 'RESET_STATE',
    }),

    resetAuth: (): AppAction => ({
        type: 'SET_USER',
        payload: null,
    }),

    resetAccount: (): AppAction => ({
        type: 'SET_ACCOUNT',
        payload: null,
    }),

    resetTransactions: (): AppAction => ({
        type: 'SET_TRANSACTIONS',
        payload: [],
    }),

    resetSavedAccounts: (): AppAction => ({
        type: 'SET_SAVED_ACCOUNTS',
        payload: [],
    }),
};
