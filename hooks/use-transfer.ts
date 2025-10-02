import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export interface TransferToAccountParams {
    account: any;
    amount: string;
    note: string;
    sourceAccountNo: string;
    partnerReferenceNo: string;
    customerReference: string;
    originatorCustomerNo?: string;
    originatorCustomerName?: string;
    originatorBankCode?: string;
    beneficiaryAddress?: string;
    beneficiaryEmail?: string;
    transactionDate: string;
}

export function useTransfer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transferToAccount = async (params: TransferToAccountParams) => {
        setLoading(true);
        setError(null);
        try {
            const result = await rawTransferToAccount(params);
            return result;
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Transfer gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { transferToAccount, loading, error };
}

export async function rawTransferToAccount(params: TransferToAccountParams) {
    const { account, amount, note, sourceAccountNo, partnerReferenceNo, customerReference, originatorCustomerNo = '', originatorCustomerName = '', originatorBankCode = '', beneficiaryAddress = 'Palembang', beneficiaryEmail = '', transactionDate } = params;
    if (!account || !account.bank || !account.account_number) {
        throw new Error('Invalid account data');
    }
    const value = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : Number(amount);
    const jwt = await AsyncStorage.getItem('jwt');
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    // Convert transactionDate to ISO format with timezone +07:00
    function toISOWithTimezone(date: string | Date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        // Pad to 2 digits
        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const min = pad(d.getMinutes());
        const sec = pad(d.getSeconds());
        // Always use +07:00 as requested
        return `${year}-${month}-${day}T${hour}:${min}:${sec}+07:00`;
    }

    if (account.bank.bank_code === '002') {
        // Intrabank transfer
        const body = {
            partnerReferenceNo,
            amount: {
                value: value.toFixed(2),
                currency: 'IDR',
            },
            beneficiaryAccountNo: account.account_number,
            customerReference,
            feeType: 'BEN',
            originatorInfos: [
                {
                    originatorCustomerNo,
                    originatorCustomerName,
                    originatorBankCode,
                },
            ],
            remark: note,
            sourceAccountNo,
            transactionDate: toISOWithTimezone(transactionDate),
            additionalInfo: {},
        };
        return api.post('/intrabank/transfer', body, { headers });
    } else {
        // Interbank transfer - use the exact structure as requested
        const body = {
            partnerReferenceNo,
            amount: {
                value: value.toFixed(2),
                currency: 'IDR',
            },
            beneficiaryAccountName: account.account_holder_name,
            beneficiaryAccountNo: account.account_number,
            beneficiaryAddress,
            beneficiaryBankCode: account.bank.bank_code,
            beneficiaryBankName: account.bank.bank_name,
            beneficiaryEmail,
            customerReference,
            sourceAccountNo,
            transactionDate: toISOWithTimezone(transactionDate),
            additionalInfo: {
                deviceId: '12345679237',
                channel: 'mobilephone',
            },
        };
        return api.post('/interbank/transfer', body, { headers });
    }
}
