import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { SecureStorage } from './secureStorage';

/**
 * Helper function to extract error message from API response
 */
export function extractErrorMessage(errorData: any): { message: string; code: string } {
    let message = '';
    let code = '';

    if (typeof errorData === 'object' && errorData !== null) {
        message = errorData.responseMessage || '';
        code = errorData.responseCode || '';
    } else if (typeof errorData === 'string') {
        message = errorData;
    }

    return { message, code };
}

/**
 * Helper function to convert API error messages to user-friendly Indonesian messages
 * Uses includes() method to handle dynamic field names
 */
export function convertToUserFriendlyMessage(technicalMessage: string): string {
    const message = technicalMessage.toLowerCase();

    // Handle dynamic messages with includes()
    if (message.includes('beneficiary account not found')) {
        return "Rekening tujuan tidak ditemukan. Periksa kembali informasi yang dimasukkan.";
    }
    if (message.includes('successful') || message.includes('success')) {
        return "Transaksi berhasil dilakukan.";
    }
    if (message.includes('invalid field format')) {
        return "Format data tidak valid. Periksa kembali input Anda.";
    }
    if (message.includes('invalid mandatory field')) {
        return "Data wajib tidak lengkap. Lengkapi semua field yang diperlukan.";
    }
    if (message.includes('unauthorized client') || message.includes('unauthoried')) {
        return "Akses ditolak. Silakan login kembali.";
    }
    if (message.includes('invalid card/account/customer') || message.includes('virtual account') || message.includes('virtualaccount')) {
        return "Data tidak ditemukan. Periksa kembali informasi yang dimasukkan.";
    }
    if (message.includes('conflict')) {
        return "Terjadi konflik data. Silakan coba lagi.";
    }
    if (message.includes('general error')) {
        return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
    }
    if (message.includes('timeout')) {
        return "Koneksi timeout. Silakan coba lagi.";
    }
    if (message.includes('request in progress')) {
        return "Permintaan sedang diproses. Silakan tunggu sebentar.";
    }
    if (message.includes('exceeds transaction amount limit')) {
        return "Jumlah transaksi melebihi batas yang diizinkan.";
    }
    if (message.includes('dormant account')) {
        return "Rekening dalam status tidak aktif. Hubungi bank untuk aktivasi.";
    }
    if (message.includes('insufficient funds')) {
        return "Saldo tidak mencukupi untuk melakukan transaksi ini.";
    }
    if (message.includes('transaction not permitted')) {
        return "Transaksi tidak diizinkan. Silakan hubungi bank untuk informasi lebih lanjut.";
    }
    if (message.includes('suspend transaction')) {
        return "Transaksi ditangguhkan. Silakan hubungi bank untuk informasi lebih lanjut.";
    }
    if (message.includes('inactive card/account/customer')) {
        return "Akun tidak aktif. Silakan hubungi bank untuk aktivasi.";
    }
    if (message.includes('invalid amount')) {
        return "Jumlah tidak valid. Periksa kembali nominal yang dimasukkan.";
    }
    if (message.includes('duplicate partnerreferenceno')) {
        return "Nomor referensi sudah digunakan. Gunakan nomor referensi yang berbeda.";
    }
    if (message.includes('internal server error')) {
        return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
    }
    if (message.includes('bad request')) {
        return "Permintaan tidak valid. Periksa kembali data yang dikirim.";
    }
    if (message.includes('invalid bill/virtual account')) {
        return "Nomor tagihan atau virtual account tidak valid.";
    }
    if (message.includes('paid bill')) {
        return "Tagihan sudah dibayar.";
    }
    if (message.includes('expired bill')) {
        return "Tagihan sudah kedaluwarsa.";
    }
    if (message.includes('transaction not found')) {
        return "Transaksi tidak ditemukan.";
    }
    if (message.includes('invalid customer token')) {
        return "Token pelanggan tidak valid. Silakan login kembali.";
    }

    // Fallback: return original message if no pattern matches
    return technicalMessage;
}

export interface ApiErrorResponse {
    error?: {
        responseCode?: string;
        responseMessage?: string;
    } | string;
    message?: string;
    responseMessage?: string;
    status?: number;
    success?: boolean;
}

export interface ProcessedError {
    message: string;
    title?: string;
    showRetry?: boolean;
    isNetworkError?: boolean;
    isSessionExpired?: boolean;
    isValidationError?: boolean;
    shouldRedirectToSignin?: boolean;
}

/**
 * Processes API errors and returns user-friendly error messages
 * Simplified version: only checks HTTP status codes
 */
export function processApiError(error: any): ProcessedError {
    const { t } = useTranslation();
    // Network error (no response)
    if (!error.response) {
        return {
            message: t('network_error_message', 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.'),
            title: t('network_error_title', 'Koneksi Gagal'),
            showRetry: true,
            isNetworkError: true,
        };
    }

    const { response } = error as AxiosError<ApiErrorResponse>;
    const status = response?.status;
    const data = response?.data;

    // Success (200) - should not reach here as error, but handle just in case
    if (status === 200) {
        return {
            message: t('transaction_success', 'Transaksi berhasil dilakukan.'),
            title: t('success'),
            showRetry: false,
        };
    }

    // Session expired (401) - check if it's invalid PIN
    if (status === 401) {
        console.log('🚨 401 Error detected:', { data, status });

        // Check if it's invalid PIN error
        let errorMessage = t('session_expired_message');
        let title = t('session_expired_title');
        let isSessionExpired = true;
        let shouldRedirectToSignin = true;

        // Extract error message to check for invalid PIN
        if (data?.error) {
            const { message: extractedMessage } = extractErrorMessage(data.error);
            console.log('🔍 Extracted error message:', extractedMessage);

            if (extractedMessage && extractedMessage.toLowerCase().includes('invalid pin')) {
                console.log('📌 Invalid PIN detected - NOT redirecting');
                errorMessage = t('pin_wrong_message');
                title = t('pin_wrong_title');
                isSessionExpired = false;
                shouldRedirectToSignin = false;
            }
        } else if (data?.message && data.message.toLowerCase().includes('invalid pin')) {
            console.log('📌 Invalid PIN detected in message - NOT redirecting');
            errorMessage = t('pin_wrong_message');
            title = t('pin_wrong_title');
            isSessionExpired = false;
            shouldRedirectToSignin = false;
        }

        console.log('🎯 401 Processing result:', { errorMessage, title, shouldRedirectToSignin });

        return {
            message: errorMessage,
            title,
            isSessionExpired,
            shouldRedirectToSignin,
        };
    }

    // All other errors - extract and convert error message
    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
    let title = 'Kesalahan';
    let showRetry = true;

    // Extract error message from response
    if (data?.error) {
        const { message: extractedMessage } = extractErrorMessage(data.error);
        if (extractedMessage) {
            errorMessage = convertToUserFriendlyMessage(extractedMessage);
        }
    } else if (data?.message) {
        errorMessage = convertToUserFriendlyMessage(data.message);
    } else if (data?.responseMessage) {
        errorMessage = convertToUserFriendlyMessage(data.responseMessage);
    }

    // Set appropriate title based on HTTP status
    if (status && status >= 400 && status < 500) {
        title = 'Data Tidak Valid';
    } else if (status && status >= 500) {
        title = 'Kesalahan Server';
    }

    return {
        message: errorMessage,
        title,
        showRetry,
    };
}

/**
 * Hook for handling API errors with automatic error modal display and navigation
 */
export function createErrorHandler(showError: (message: string, options?: any) => void, router?: any) {
    return (error: any, customOptions?: Partial<ProcessedError>) => {
        console.log('🔥 createErrorHandler called with:', {
            hasRouter: !!router,
            errorStatus: error?.response?.status,
            customOptions
        });

        const processedError = processApiError(error);
        const options = { ...processedError, ...customOptions };

        console.log('📋 Processed options:', options);

        // Handle navigation for session expired (401 but not invalid PIN)
        if (options.shouldRedirectToSignin && router) {
            console.log('🔄 Session expired - showing modal first, then redirecting');

            // Show modal first, then redirect when user closes it
            showError(options.message, {
                title: options.title,
                showRetry: false, // Don't show retry for session expired
                onClose: () => {
                    console.log('📱 Modal closed - clearing tokens and redirecting');
                    // Clear any stored tokens before redirecting
                    SecureStorage.logout();

                    // Redirect to signin screen
                    router.replace('/signin');
                }
            });
            return processedError;
        } else if (options.shouldRedirectToSignin && !router) {
            console.log('❌ Should redirect but no router provided');
        }

        console.log('📱 Showing error modal:', options.message);
        showError(options.message, {
            title: options.title,
            showRetry: options.showRetry,
        });

        return processedError;
    };
}
