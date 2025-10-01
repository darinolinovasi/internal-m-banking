import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useSaveAccountNumber() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveAccountNumber = async (data: {
        account_number: string;
        bank_id: string;
        account_type: string;
        virtual_account_code: string;
        account_holder_name: string;
        note: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const jwt = await AsyncStorage.getItem('jwt');
            const response = await api.post('/account/save-account-number', data, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menyimpan nomor rekening.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { saveAccountNumber, loading, error };
}
