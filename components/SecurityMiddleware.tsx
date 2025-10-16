/**
 * Security middleware component for handling security-related functionality
 */

import { SECURITY_CONSTANTS } from '@/config/security';
import { SecureStorage } from '@/utils/secureStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SecurityContextType {
    isAuthenticated: boolean;
    sessionExpired: boolean;
    loginAttempts: number;
    pinAttempts: number;
    isLocked: boolean;
    lockoutEndTime: number | null;
    checkSession: () => Promise<void>;
    incrementLoginAttempts: () => void;
    incrementPinAttempts: () => void;
    resetAttempts: () => void;
    lockAccount: (duration?: number) => void;
    unlockAccount: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [pinAttempts, setPinAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

    // Check authentication status
    const checkSession = async () => {
        try {
            const jwt = await SecureStorage.getJWT();
            const isAuth = jwt !== null && jwt.length > 0;
            setIsAuthenticated(isAuth);

            if (!isAuth) {
                setSessionExpired(true);
            }
        } catch (error) {
            console.error('Error checking session:', error);
            setIsAuthenticated(false);
            setSessionExpired(true);
        }
    };

    // Increment login attempts
    const incrementLoginAttempts = () => {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
            lockAccount();
        }
    };

    // Increment PIN attempts
    const incrementPinAttempts = () => {
        const newAttempts = pinAttempts + 1;
        setPinAttempts(newAttempts);

        if (newAttempts >= SECURITY_CONSTANTS.MAX_PIN_ATTEMPTS) {
            lockAccount();
        }
    };

    // Reset all attempts
    const resetAttempts = () => {
        setLoginAttempts(0);
        setPinAttempts(0);
    };

    // Lock account
    const lockAccount = (duration: number = SECURITY_CONSTANTS.PIN_LOCKOUT_DURATION) => {
        setIsLocked(true);
        setLockoutEndTime(Date.now() + duration);

        // Auto-unlock after duration
        setTimeout(() => {
            unlockAccount();
        }, duration);
    };

    // Unlock account
    const unlockAccount = () => {
        setIsLocked(false);
        setLockoutEndTime(null);
        resetAttempts();
    };

    // Check lockout status
    useEffect(() => {
        if (lockoutEndTime && Date.now() >= lockoutEndTime) {
            unlockAccount();
        }
    }, [lockoutEndTime]);

    // Check authentication on mount
    useEffect(() => {
        checkSession();
    }, []);

    const value: SecurityContextType = {
        isAuthenticated,
        sessionExpired,
        loginAttempts,
        pinAttempts,
        isLocked,
        lockoutEndTime,
        checkSession,
        incrementLoginAttempts,
        incrementPinAttempts,
        resetAttempts,
        lockAccount,
        unlockAccount,
    };

    return (
        <SecurityContext.Provider value={value}>
            {children}
        </SecurityContext.Provider>
    );
}

export function useSecurity() {
    const context = useContext(SecurityContext);
    if (context === undefined) {
        throw new Error('useSecurity must be used within a SecurityProvider');
    }
    return context;
}
