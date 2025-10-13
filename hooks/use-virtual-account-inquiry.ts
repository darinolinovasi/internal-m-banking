import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useVirtualAccountInquiry() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inquiryVirtualAccount = async (virtualAccountNumber: string) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = '/va/inquiry';
            // partner service id is first 5 digits of virtual account number with left padding space
            const partnerServiceId = virtualAccountNumber.slice(0, 5).padStart(8, ' ');
            // customer no is the virtual account number
            const customerNo = virtualAccountNumber.slice(5);
            // virtual account number is partner service id and customer no
            const VirtualAccountNo = partnerServiceId + customerNo;
            const requestBody = {
                partnerServiceId: partnerServiceId,
                customerNo: customerNo,
                virtualAccountNo: VirtualAccountNo,
                additionalInfo: {
                    deviceId: '12345679237',
                    channel: 'mobilephone',
                },
            };

            const jwt = await AsyncStorage.getItem('jwt');
            const response = await api.post(endpoint, requestBody, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response;
        } catch (err: any) {
            const errorMessage = getVirtualAccountErrorMessage(err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getVirtualAccountErrorMessage = (err: any): string => {
        if (!err.response || !err.response.data) {
            return 'Network error. Please try again.';
        }

        const { status, data } = err.response;

        // Handle specific virtual account error cases
        if (status === 404) {
            return 'Virtual account number not found.';
        }

        if (status === 400) {
            if (data.error && data.error.responseMessage) {
                const message = data.error.responseMessage.toLowerCase();
                if (message.includes('invalid') || message.includes('invalid format')) {
                    return 'Invalid virtual account number format.';
                }
                if (message.includes('expired') || message.includes('inactive')) {
                    return 'Virtual account has expired or is inactive.';
                }
            }
            return 'Invalid virtual account number.';
        }

        if (status === 403) {
            return 'Access denied for virtual account inquiry.';
        }

        if (status >= 500) {
            return 'Server error. Please try again later.';
        }

        // Default error message
        return 'Failed to validate virtual account. Please try again.';
    };

    const clearError = () => {
        setError(null);
    };

    return {
        inquiryVirtualAccount,
        loading,
        error,
        clearError
    };
}
