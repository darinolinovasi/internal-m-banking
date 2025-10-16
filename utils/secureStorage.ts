/**
 * Secure storage utilities for sensitive data
 * Uses Expo SecureStore for sensitive data and AsyncStorage for non-sensitive data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Keys for different types of data
export const STORAGE_KEYS = {
    // Sensitive data - stored in SecureStore
    JWT: 'jwt_token',
    REFRESH_TOKEN: 'refresh_token',
    PIN: 'user_pin',
    BIOMETRIC_ENABLED: 'biometric_enabled',

    // Non-sensitive data - stored in AsyncStorage
    USER_INFO: 'user',
    LANGUAGE: 'language',
    THEME: 'theme',
    BANK_CARD_TOKEN: 'bank_card_token',
    ACCOUNT_NUMBER: 'account_number',
    DEVICE_ID: 'device_id',
    APP_SETTINGS: 'app_settings',
} as const;

/**
 * Secure storage class for handling sensitive data
 */
export class SecureStorage {
    /**
     * Store sensitive data securely
     */
    static async setSecureItem(key: string, value: string): Promise<boolean> {
        try {
            await SecureStore.setItemAsync(key, value);
            return true;
        } catch (error) {
            console.error('Failed to store secure item:', error);
            return false;
        }
    }

    /**
     * Retrieve sensitive data securely
     */
    static async getSecureItem(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error('Failed to retrieve secure item:', error);
            return null;
        }
    }

    /**
     * Remove sensitive data
     */
    static async removeSecureItem(key: string): Promise<boolean> {
        try {
            await SecureStore.deleteItemAsync(key);
            return true;
        } catch (error) {
            console.error('Failed to remove secure item:', error);
            return false;
        }
    }

    /**
     * Store non-sensitive data
     */
    static async setItem(key: string, value: string): Promise<boolean> {
        try {
            await AsyncStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error('Failed to store item:', error);
            return false;
        }
    }

    /**
     * Retrieve non-sensitive data
     */
    static async getItem(key: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('Failed to retrieve item:', error);
            return null;
        }
    }

    /**
     * Remove non-sensitive data
     */
    static async removeItem(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove item:', error);
            return false;
        }
    }

    /**
     * Clear all stored data (both secure and non-secure)
     */
    static async clearAll(): Promise<boolean> {
        try {
            // Clear secure storage
            await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);

            // Clear async storage
            await AsyncStorage.clear();

            return true;
        } catch (error) {
            console.error('Failed to clear all storage:', error);
            return false;
        }
    }

    /**
     * Store JWT token securely
     */
    static async setJWT(token: string): Promise<boolean> {
        return this.setSecureItem(STORAGE_KEYS.JWT, token);
    }

    /**
     * Get JWT token securely
     */
    static async getJWT(): Promise<string | null> {
        return this.getSecureItem(STORAGE_KEYS.JWT);
    }

    /**
     * Store refresh token securely
     */
    static async setRefreshToken(token: string): Promise<boolean> {
        return this.setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    }

    /**
     * Get refresh token securely
     */
    static async getRefreshToken(): Promise<string | null> {
        return this.getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    /**
     * Store user PIN securely
     */
    static async setPIN(pin: string): Promise<boolean> {
        return this.setSecureItem(STORAGE_KEYS.PIN, pin);
    }

    /**
     * Get user PIN securely
     */
    static async getPIN(): Promise<string | null> {
        return this.getSecureItem(STORAGE_KEYS.PIN);
    }

    /**
     * Store user information (non-sensitive)
     */
    static async setUserInfo(userInfo: any): Promise<boolean> {
        try {
            const userString = JSON.stringify(userInfo);
            return this.setItem(STORAGE_KEYS.USER_INFO, userString);
        } catch (error) {
            console.error('Failed to store user info:', error);
            return false;
        }
    }

    /**
     * Get user information
     */
    static async getUserInfo(): Promise<any | null> {
        try {
            const userString = await this.getItem(STORAGE_KEYS.USER_INFO);
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error('Failed to retrieve user info:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    static async isAuthenticated(): Promise<boolean> {
        const jwt = await this.getJWT();
        return jwt !== null && jwt.length > 0;
    }

    /**
     * Logout user (clear all auth data)
     */
    static async logout(): Promise<boolean> {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
            return true;
        } catch (error) {
            console.error('Failed to logout:', error);
            return false;
        }
    }
}
