import api from "@/api/api";
import { SECURITY_CONFIG } from "@/config/security";
import { SecureStorage } from "@/utils/secureStorage";
import { useState } from "react";

export function useAccount() {
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    const fetchAccountBalance = async (accountNo: string) => {
        setLoading(true);
        setError(null);
        try {
            // Get bank card token from secure storage or use default
            const bankCardToken = await SecureStorage.getItem('bank_card_token') || SECURITY_CONFIG.BANK_CARD_TOKEN;

            const response = await api.post('/account/balance', {
                accountNo,
                bankCardToken
            });

            setAccount(response.data?.data || null);
            return response.data?.data;

        } catch (err: any) {
            // Check if it's a 401 error (session expired)
            if (err?.response?.status === 401) {
                setSessionExpired(true);
                setError('Session expired');
            } else {
                setError(err?.message || 'Failed to fetch account');
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearSessionExpired = () => {
        setSessionExpired(false);
    };

    return { account, loading, error, sessionExpired, clearSessionExpired, fetchAccountBalance };
}