import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export interface VirtualAccountTransferParams {
    virtualAccountData: {
        virtualAccountNo: string;
        virtualAccountName: string;
        totalAmount: {
            currency: string;
            value: string;
        };
        partnerServiceId: string;
        customerNo: string;
    };
    amount: string;
    note: string;
    sourceAccountNo: string;
    partnerReferenceNo: string;
    customerReference: string;
    transactionDate: string;
    internalData?: {
        recipientAccountID: number | null;
        recipientAccountType: string;
        recipientName: string;
        bankID: number;
        TransferType: string;
        TransactionType: string;
    };
}

export function useVirtualAccountTransfer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transferToVirtualAccount = async (params: VirtualAccountTransferParams) => {
        setLoading(true);
        setError(null);
        try {
            const result = await rawTransferToVirtualAccount(params);
            return result;
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.message || 'Transfer gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { transferToVirtualAccount, loading, error };
}

export async function rawTransferToVirtualAccount(params: VirtualAccountTransferParams) {
    const { virtualAccountData, amount, note, sourceAccountNo, partnerReferenceNo, customerReference, transactionDate, internalData } = params;

    if (!virtualAccountData || !virtualAccountData.virtualAccountNo) {
        throw new Error('Invalid virtual account data');
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

    const body = {
        partnerServiceId: virtualAccountData.partnerServiceId,
        customerNo: virtualAccountData.customerNo,
        virtualAccountNo: virtualAccountData.virtualAccountNo,
        virtualAccountName: virtualAccountData.virtualAccountName,
        sourceAccountNo,
        partnerReferenceNo,
        trxDateTime: toISOWithTimezone(transactionDate),
        paidAmount: {
            value: value.toFixed(2),
            currency: 'IDR',
        },
        remark: note,
        customerReference,
        additionalInfo: {
            deviceId: '12345679237',
            channel: 'mobilephone',
        },
        internalData: internalData || {
            recipientAccountID: 0, // Virtual account doesn't have a specific account ID
            recipientAccountType: "virtual_account",
            recipientName: virtualAccountData.virtualAccountName,
            bankID: 0, // Virtual account doesn't have a specific bank ID
            TransferType: "manual",
            TransactionType: "transfer_out"
        },
    };

    return api.post('/va/transfer', body, { headers });
}
