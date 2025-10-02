import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useInquiry() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inquiry = async (bank: { bank_code: string }, accountNumber: string) => {
        setLoading(true);
        setError(null);
        try {
            let endpoint = bank.bank_code === '002' ? '/intrabank/inquiry' : '/interbank/inquiry';
            let requestBody;
            if (bank.bank_code === '002') {
                requestBody = {
                    beneficiaryAccountNo: accountNumber,
                    additionalInfo: {
                        deviceId: '12345679237',
                        channel: 'mobilephone',
                    },
                };
            } else {
                requestBody = {
                    beneficiaryBankCode: bank.bank_code,
                    beneficiaryAccountNo: accountNumber,
                    additionalInfo: {
                        deviceId: '12345679237',
                        channel: 'mobilephone',
                    },
                };
            }
            const jwt = await AsyncStorage.getItem('jwt');
            const response = await api.post(endpoint, requestBody, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response;
        } catch (err: any) {
            setError(
                (!err.response || !err.response.data)
                    ? 'Terjadi kesalahan jaringan. Silakan coba lagi.'
                    : (err.response.status === 403 || err.response.status === 400)
                        && (err.response.data.error.responseMessage.toLowerCase().includes('inactive') || err.response.data.error.responseMessage.toLowerCase().includes('invalid'))
                        ? 'Nomor rekening tidak valid. Periksa kembali?'
                        : 'Terjadi Kesalahan.'
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { inquiry, loading, error };
}
