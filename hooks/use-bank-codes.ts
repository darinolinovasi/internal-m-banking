import api from '@/api/api';
import { useEffect, useState } from 'react';

export function useBankCodes() {
    const [banks, setBanks] = useState<{ bank_name: string; bank_code: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.get('/interbank/bank-codes')
            .then(res => setBanks(res.data.data))
            .catch(err => setError(err.response?.data?.message || 'Gagal memuat daftar bank'))
            .finally(() => setLoading(false));
    }, []);

    return { banks, loading, error };
}
