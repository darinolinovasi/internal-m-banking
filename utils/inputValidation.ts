/**
 * Input validation utilities for security
 */

import { SECURITY_ERRORS, VALIDATION_PATTERNS } from '@/config/security';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_EMAIL };
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!VALIDATION_PATTERNS.EMAIL.test(trimmedEmail)) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_EMAIL };
    }

    return { isValid: true };
}

/**
 * Validates phone number format (Indonesian)
 */
export function validatePhone(phone: string): ValidationResult {
    if (!phone || typeof phone !== 'string') {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_PHONE };
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!VALIDATION_PATTERNS.PHONE.test(cleanedPhone)) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_PHONE };
    }

    return { isValid: true };
}

/**
 * Validates account number format
 */
export function validateAccountNumber(accountNumber: string): ValidationResult {
    if (!accountNumber || typeof accountNumber !== 'string') {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_ACCOUNT_NUMBER };
    }

    const cleanedAccount = accountNumber.replace(/\s+/g, '');
    if (!VALIDATION_PATTERNS.ACCOUNT_NUMBER.test(cleanedAccount)) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_ACCOUNT_NUMBER };
    }

    return { isValid: true };
}

/**
 * Validates PIN format
 */
export function validatePIN(pin: string): ValidationResult {
    if (!pin || typeof pin !== 'string') {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_PIN };
    }

    if (!VALIDATION_PATTERNS.PIN.test(pin)) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_PIN };
    }

    return { isValid: true };
}

/**
 * Validates virtual account number
 */
export function validateVirtualAccount(virtualAccount: string): ValidationResult {
    if (!virtualAccount || typeof virtualAccount !== 'string') {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_VIRTUAL_ACCOUNT };
    }

    const cleanedVA = virtualAccount.replace(/\s+/g, '');
    if (!VALIDATION_PATTERNS.VIRTUAL_ACCOUNT.test(cleanedVA)) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_VIRTUAL_ACCOUNT };
    }

    return { isValid: true };
}

/**
 * Validates transaction amount
 */
export function validateAmount(amount: string | number): ValidationResult {
    if (amount === null || amount === undefined) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_AMOUNT };
    }

    const amountStr = typeof amount === 'number' ? amount.toString() : amount;
    const cleanedAmount = amountStr.replace(/[^\d.]/g, '');

    if (!VALIDATION_PATTERNS.AMOUNT.test(cleanedAmount)) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_AMOUNT };
    }

    const numericAmount = parseFloat(cleanedAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return { isValid: false, error: SECURITY_ERRORS.INVALID_AMOUNT };
    }

    return { isValid: true };
}

/**
 * Sanitizes input string to prevent XSS
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .substring(0, 1000); // Limit length
}

/**
 * Validates and sanitizes text input
 */
export function validateAndSanitizeText(text: string, maxLength: number = 1000): ValidationResult {
    if (!text || typeof text !== 'string') {
        return { isValid: false, error: 'Invalid text input' };
    }

    const sanitized = sanitizeInput(text);
    if (sanitized.length > maxLength) {
        return { isValid: false, error: `Text must be less than ${maxLength} characters` };
    }

    return { isValid: true };
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): ValidationResult {
    if (!password || typeof password !== 'string') {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    if (password.length > 128) {
        return { isValid: false, error: 'Password must be less than 128 characters' };
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }

    return { isValid: true };
}
