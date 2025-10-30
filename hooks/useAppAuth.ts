/**
 * Optimized Authentication Hook with State Management
 * Provides authentication management with caching and session handling
 */

import api from '@/api/api';
import { authActions } from '@/contexts/AppActions';
import { useAppState } from '@/contexts/AppStateContext';
import { CACHE_CONFIGS, CACHE_KEYS, dataCache } from '@/utils/DataCache';
import { validateEmail, validatePasswordStrength } from '@/utils/inputValidation';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export interface LoginCredentials {
    email: string;
    password: string;
}

export function useAppAuth() {
    const { state, dispatch } = useAppState();
    const { user, isAuthenticated, sessionExpired, loading, errors: error } = state;
    const router = useRouter();

    /**
     * Sign in with email and password
     */
    const signIn = useCallback(async (credentials: LoginCredentials) => {
        dispatch(authActions.setAuthLoading(true));
        dispatch(authActions.setAuthError(null));

        // Validate input
        const emailValidation = validateEmail(credentials.email);
        if (!emailValidation.isValid) {
            const error = emailValidation.error || 'Invalid email';
            dispatch(authActions.setAuthError(error));
            dispatch(authActions.setAuthLoading(false));
            throw new Error(error);
        }

        const passwordValidation = validatePasswordStrength(credentials.password);
        if (!passwordValidation.isValid) {
            const error = passwordValidation.error || 'Invalid password';
            dispatch(authActions.setAuthError(error));
            dispatch(authActions.setAuthLoading(false));
            throw new Error(error);
        }

        try {
            const response = await api.post('/auth/login', credentials);
            const { jwt, refresh_token, user: userData } = response.data?.data || {};

            if (jwt && userData) {
                // Save to secure storage
                await SecureStorage.setJWT(jwt);
                await SecureStorage.setRefreshToken(refresh_token);
                await SecureStorage.setUserInfo(userData);

                // Update state
                dispatch(authActions.setUser(userData));
                dispatch(authActions.setAuthenticated(true));
                dispatch(authActions.setSessionExpired(false));

                // Cache user data
                await dataCache.set(CACHE_KEYS.USER, userData, CACHE_CONFIGS.USER);

                return { user: userData, jwt, refresh_token };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Login failed';
            dispatch(authActions.setAuthError(errorMessage));
            throw err;
        } finally {
            dispatch(authActions.setAuthLoading(false));
        }
    }, [dispatch]);

    /**
     * Sign out and clear all data
     */
    const signOut = useCallback(async () => {
        try {
            // Clear secure storage
            await SecureStorage.logout();

            // Clear cache
            await dataCache.clear();

            // Reset state
            dispatch({ type: 'RESET_STATE' });

            // Navigate to sign in
            router.replace('/');
        } catch (error) {
            console.error('Error during sign out:', error);
            // Still reset state even if logout fails
            dispatch({ type: 'RESET_STATE' });
            router.replace('/');
        }
    }, [dispatch, router]);

    /**
     * Check authentication status
     */
    const checkAuthStatus = useCallback(async () => {
        try {
            const jwt = await SecureStorage.getJWT();
            const userData = await SecureStorage.getUserInfo();

            if (jwt && userData) {
                dispatch(authActions.setUser(userData));
                dispatch(authActions.setAuthenticated(true));
                dispatch(authActions.setSessionExpired(false));
                return true;
            } else {
                dispatch(authActions.setAuthenticated(false));
                dispatch(authActions.setUser(null));
                return false;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            dispatch(authActions.setAuthenticated(false));
            dispatch(authActions.setUser(null));
            return false;
        }
    }, [dispatch]);

    /**
     * Handle session expiration
     */
    const handleSessionExpired = useCallback(async () => {
        dispatch(authActions.setSessionExpired(true));

        // Clear sensitive data
        await SecureStorage.logout();
        await dataCache.clear();

        // Reset state
        dispatch({ type: 'RESET_STATE' });

        // Navigate to sign in
        router.replace('/');
    }, [dispatch, router]);

    /**
     * Clear session expired flag
     */
    const clearSessionExpired = useCallback(() => {
        dispatch(authActions.setSessionExpired(false));
    }, [dispatch]);

    /**
     * Refresh user data
     */
    const refreshUserData = useCallback(async () => {
        try {
            const userData = await SecureStorage.getUserInfo();
            if (userData) {
                dispatch(authActions.setUser(userData));
                await dataCache.set(CACHE_KEYS.USER, userData, CACHE_CONFIGS.USER);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    }, [dispatch]);

    /**
     * Update user profile
     */
    const updateUserProfile = useCallback(async (updates: Partial<typeof user>) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };

        // Update secure storage
        await SecureStorage.setUserInfo(updatedUser);

        // Update state
        dispatch(authActions.setUser(updatedUser));

        // Update cache
        await dataCache.set(CACHE_KEYS.USER, updatedUser, CACHE_CONFIGS.USER);

        return updatedUser;
    }, [dispatch, user]);

    return {
        user,
        isAuthenticated,
        sessionExpired,
        loading,
        error,
        signIn,
        signOut,
        checkAuthStatus,
        handleSessionExpired,
        clearSessionExpired,
        refreshUserData,
        updateUserProfile,
    };
}
