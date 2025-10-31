import Constants from 'expo-constants';
/**
 * Security configuration and constants
 * This file contains all security-related configurations and constants
 */

// Environment variables with fallbacks
export const SECURITY_CONFIG = {
    // API Configuration
    API_BASE_URL: Constants.expoConfig?.extra?.apiUrl || "",
    API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000'),

    // Device Configuration
    DEVICE_ID: Constants.expoConfig?.extra?.deviceId || 'secure-device-id',
    BANK_CARD_TOKEN: Constants.expoConfig?.extra?.bankCardToken || 'secure-bank-card-token',
    CHANNEL: process.env.EXPO_PUBLIC_CHANNEL || 'mobilephone',

    // Security Features
    ENABLE_SSL_PINNING: process.env.EXPO_PUBLIC_ENABLE_SSL_PINNING === 'true',
    ENABLE_CERTIFICATE_VALIDATION: process.env.EXPO_PUBLIC_ENABLE_CERTIFICATE_VALIDATION === 'true',

    // Environment
    ENVIRONMENT: Constants.expoConfig?.extra?.environment || 'development',
    DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',

    // SNAP API selector (from .env). Expected values: 'ASPI' | 'BRI'
    SNAP_API: (Constants.expoConfig?.extra?.snapApi || 'ASPI').toUpperCase(),
} as const;

// Security headers for API requests
export const SECURITY_HEADERS = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Version': '1.0.0',
    'X-Platform': 'react-native',
    'X-Device-Type': 'mobile',
} as const;

// Input validation patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^(\+62|62|0)[0-9]{9,13}$/,
    ACCOUNT_NUMBER: /^[0-9]{10,16}$/,
    PIN: /^[0-9]{6}$/,
    VIRTUAL_ACCOUNT: /^[0-9]{3,}$/,
    AMOUNT: /^[0-9]+(\.[0-9]{1,2})?$/,
} as const;

// Security constants
export const SECURITY_CONSTANTS = {
    MAX_LOGIN_ATTEMPTS: 3,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MAX_PIN_ATTEMPTS: 3,
    PIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    MAX_TRANSACTION_AMOUNT: 100000000, // 100 million IDR
    MIN_TRANSACTION_AMOUNT: 1000, // 1 thousand IDR
} as const;

// Error messages for security
export const SECURITY_ERRORS = {
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PHONE: 'Invalid phone number format',
    INVALID_ACCOUNT_NUMBER: 'Invalid account number format',
    INVALID_PIN: 'PIN must be 6 digits',
    INVALID_VIRTUAL_ACCOUNT: 'Invalid virtual account number',
    INVALID_AMOUNT: 'Invalid amount format',
    MAX_LOGIN_ATTEMPTS_EXCEEDED: 'Maximum login attempts exceeded. Please try again later.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    INVALID_TOKEN: 'Invalid or expired token',
    SECURITY_VIOLATION: 'Security violation detected',
} as const;
