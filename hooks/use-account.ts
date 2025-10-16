import api from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
            // Simulate API call
            const response = await api.post('/account/balance', {
                accountNo,
                bankCardToken: "6d7963617264746f6b656e"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('jwt')}`
                },
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