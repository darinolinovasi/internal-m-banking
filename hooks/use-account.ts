import api from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export function useAccount() {
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccountBalance = async (accountNo: string) => {
        setLoading(true);
        setError(null);
        try {
            // Simulate API call
            const response = await api.post('/account/balance', {
                accountNo
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('jwt')}`
                },
            });

            setAccount(response.data?.data || null);
            return response.data?.data;

        } catch (err: any) {
            setError(err?.message || 'Failed to fetch account');
            console.log("Error fetching account balance:", err.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { account, loading, error, fetchAccountBalance };
}