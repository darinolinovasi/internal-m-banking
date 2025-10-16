import ErrorModal, { ErrorModalProps } from '@/components/ErrorModal';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface ErrorContextType {
    showError: (message: string, options?: Partial<ErrorModalProps>) => void;
    hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
    children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
    const [errorState, setErrorState] = useState<{
        visible: boolean;
        title?: string;
        message: string;
        buttonText?: string;
        showRetry?: boolean;
        onRetry?: () => void;
        onClose?: () => void;
    }>({
        visible: false,
        message: '',
    });

    const showError = useCallback((message: string, options?: Partial<ErrorModalProps>) => {
        setErrorState({
            visible: true,
            message,
            title: options?.title,
            buttonText: options?.buttonText,
            showRetry: options?.showRetry,
            onRetry: options?.onRetry,
            onClose: options?.onClose,
        });
    }, []);

    const hideError = useCallback(() => {
        // Call custom onClose callback if provided
        if (errorState.onClose) {
            errorState.onClose();
        }

        setErrorState(prev => ({
            ...prev,
            visible: false,
        }));
    }, [errorState.onClose]);

    const handleRetry = useCallback(() => {
        if (errorState.onRetry) {
            errorState.onRetry();
        }
        hideError();
    }, [errorState.onRetry, hideError]);

    return (
        <ErrorContext.Provider value={{ showError, hideError }}>
            {children}
            <ErrorModal
                visible={errorState.visible}
                title={errorState.title}
                message={errorState.message}
                buttonText={errorState.buttonText}
                showRetry={errorState.showRetry}
                onRetry={errorState.showRetry ? handleRetry : undefined}
                onClose={hideError}
            />
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}
