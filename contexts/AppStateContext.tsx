/**
 * Centralized App State Management
 * This context provides global state management for the entire application
 */

import { SecureStorage } from '@/utils/secureStorage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

// Types
export interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
}

export interface Account {
    accountNo: string;
    balance: number;
    currency: string;
    accountName?: string;
}

export interface SavedAccount {
    id: string;
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    date: string;
    balance: number;
}

// State Interface
export interface AppState {
    // Authentication
    isAuthenticated: boolean;
    user: User | null;
    sessionExpired: boolean;

    // Account Data
    account: Account | null;
    savedAccounts: SavedAccount[];

    // Transactions
    transactions: Transaction[];
    recentTransactions: Transaction[];

    // UI State
    loading: {
        auth: boolean;
        account: boolean;
        transactions: boolean;
        savedAccounts: boolean;
    };

    // Cache
    lastFetch: {
        account: number | null;
        transactions: number | null;
        savedAccounts: number | null;
    };

    // Error State
    errors: {
        auth: string | null;
        account: string | null;
        transactions: string | null;
        savedAccounts: string | null;
    };
}

// Action Types
export type AppAction =
    | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
    | { type: 'SET_ERROR'; payload: { key: keyof AppState['errors']; value: string | null } }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_AUTHENTICATED'; payload: boolean }
    | { type: 'SET_SESSION_EXPIRED'; payload: boolean }
    | { type: 'SET_ACCOUNT'; payload: Account | null }
    | { type: 'SET_SAVED_ACCOUNTS'; payload: SavedAccount[] }
    | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'SET_RECENT_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'ADD_TRANSACTION'; payload: Transaction }
    | { type: 'UPDATE_ACCOUNT_BALANCE'; payload: number }
    | { type: 'CLEAR_CACHE' }
    | { type: 'RESET_STATE' }
    | { type: 'SET_LAST_FETCH'; payload: { key: keyof AppState['lastFetch']; value: number } };

// Initial State
const initialState: AppState = {
    isAuthenticated: false,
    user: null,
    sessionExpired: false,
    account: null,
    savedAccounts: [],
    transactions: [],
    recentTransactions: [],
    loading: {
        auth: false,
        account: false,
        transactions: false,
        savedAccounts: false,
    },
    lastFetch: {
        account: null,
        transactions: null,
        savedAccounts: null,
    },
    errors: {
        auth: null,
        account: null,
        transactions: null,
        savedAccounts: null,
    },
};

// Reducer
function appStateReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.key]: action.payload.value,
                },
            };

        case 'SET_ERROR':
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.key]: action.payload.value,
                },
            };

        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
            };

        case 'SET_AUTHENTICATED':
            return {
                ...state,
                isAuthenticated: action.payload,
            };

        case 'SET_SESSION_EXPIRED':
            return {
                ...state,
                sessionExpired: action.payload,
            };

        case 'SET_ACCOUNT':
            return {
                ...state,
                account: action.payload,
            };

        case 'SET_SAVED_ACCOUNTS':
            return {
                ...state,
                savedAccounts: action.payload,
            };

        case 'SET_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload,
                recentTransactions: action.payload.slice(0, 5), // Keep only recent 5
            };

        case 'SET_RECENT_TRANSACTIONS':
            return {
                ...state,
                recentTransactions: action.payload,
            };

        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
                recentTransactions: [action.payload, ...state.recentTransactions.slice(0, 4)],
            };

        case 'UPDATE_ACCOUNT_BALANCE':
            return {
                ...state,
                account: state.account ? { ...state.account, balance: action.payload } : null,
            };

        case 'CLEAR_CACHE':
            return {
                ...state,
                lastFetch: {
                    account: null,
                    transactions: null,
                    savedAccounts: null,
                },
            };

        case 'RESET_STATE':
            return initialState;

        case 'SET_LAST_FETCH':
            return {
                ...state,
                lastFetch: {
                    ...state.lastFetch,
                    [action.payload.key]: action.payload.value,
                },
            };

        default:
            return state;
    }
}

// Context
const AppStateContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppStateProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appStateReducer, initialState);

    // Initialize app state from secure storage
    useEffect(() => {
        const initializeApp = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } });

                const jwt = await SecureStorage.getJWT();
                const user = await SecureStorage.getUserInfo();

                if (jwt && user) {
                    dispatch({ type: 'SET_USER', payload: user });
                    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
                } else {
                    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
                }
            } catch (error) {
                console.error('Error initializing app state:', error);
                dispatch({ type: 'SET_ERROR', payload: { key: 'auth', value: 'Failed to initialize app' } });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
            }
        };

        initializeApp();
    }, []);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
}

// Hook
export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}

// Selector hooks for better performance
export function useUser() {
    const { state } = useAppState();
    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionExpired: state.sessionExpired,
        loading: state.loading.auth,
        error: state.errors.auth,
    };
}

export function useAccount() {
    const { state } = useAppState();
    return {
        account: state.account,
        loading: state.loading.account,
        error: state.errors.account,
        lastFetch: state.lastFetch.account,
    };
}

export function useTransactions() {
    const { state } = useAppState();
    return {
        transactions: state.transactions,
        recentTransactions: state.recentTransactions,
        loading: state.loading.transactions,
        error: state.errors.transactions,
        lastFetch: state.lastFetch.transactions,
    };
}

export function useSavedAccounts() {
    const { state } = useAppState();
    return {
        savedAccounts: state.savedAccounts,
        loading: state.loading.savedAccounts,
        error: state.errors.savedAccounts,
        lastFetch: state.lastFetch.savedAccounts,
    };
}
