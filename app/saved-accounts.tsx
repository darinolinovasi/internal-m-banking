import { Logos } from '@/assets/logos';
import AccountNumberInputSheet from '@/components/AccountNumberInputSheet';
import BankListSheet from '@/components/BankListSheet';
import { useSavedAccounts } from '@/hooks/use-saved-accounts';
import { useTransfer } from '@/hooks/use-transfer';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import pkg from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlatList, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import TransferRekeningSheet from '../components/TransferRekeningSheet';
import VerifyPinModal from '../components/VerifyPinModal';

const { debounce } = pkg;

export default function SavedAccountsScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSheet, setShowSheet] = useState(false);
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [viewAccount, setViewAccount] = useState<any>(null);
    const [editAmount, setEditAmount] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [tempAmount, setTempAmount] = useState('0');
    const [tempNote, setTempNote] = useState('Catatan transfer');
    const [showVerifyPin, setShowVerifyPin] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferResult, setTransferResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = ['100%'];
    const { accounts, loading, error, refetch, statusCode } = useSavedAccounts();
    const { transferToAccount, loading: transferLoading, error: transferError } = useTransfer();
    const router = useRouter();

    // Debounce handlers (no useEffect)
    const debouncedSetSearch = React.useMemo(() => debounce((val: string) => setDebouncedSearch(val), 300), []);
    const handleSearchChange = (val: string) => {
        setSearch(val);
        debouncedSetSearch(val);
    };

    const filteredAccounts = accounts.filter(
        a =>
            (a.account_holder_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (a.bank?.bank_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (a.account_number || '').replace(/\s/g, '').includes(debouncedSearch.replace(/\s/g, ''))
    );

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setShowSheet(false);
            setSelectedBank(null); // Clear selected bank when sheet is closed
            setAccountNumber(''); // Optionally clear account number as well
        }
        bottomSheetRef.current?.expand();
    }, []);

    const handleBankPress = (bank: any) => {
        setSelectedBank(bank);
        setAccountNumber('');
    };
    const handleBack = () => {
        setSelectedBank(null);
        setAccountNumber('');
    };
    const handleKeypad = (val: string) => {
        if (accountNumber.length < 16) setAccountNumber(accountNumber + val);
    };
    const handleDelete = () => {
        setAccountNumber(accountNumber.slice(0, -1));
    };

    // Add a handler to close the sheet from child
    const handleAccountSaved = () => {
        setShowSheet(false);
        setSelectedBank(null);
        setAccountNumber('');
        refetch(); // Refresh the saved accounts list
    };

    // Handler for after PIN is verified
    const handlePinVerified = async () => {
        setShowVerifyPin(false);
        if (!viewAccount) return;
        // Validate minimum amount
        const cleanAmount = String(tempAmount).replace(/[^\d]/g, '');
        const noteToSend = tempNote ? tempNote : '';
        if (!cleanAmount || Number(cleanAmount) < 10000) {
            setTransferResult({ success: false, message: 'Nominal transfer minimal Rp 10.000' });
            setShowErrorModal(true);
            return;
        }
        setIsTransferring(true);
        setTransferResult(null);
        try {
            const response = await transferToAccount({
                account: viewAccount,
                amount: cleanAmount,
                note: noteToSend,
                partnerReferenceNo: '20211130000000001',
                customerReference: '10052023',
                sourceAccountNo: '2000200202',
                transactionDate: "2021-11-24T10:30:24+07:00",
                // The following are not used for interbank, but required for intrabank signature
                originatorCustomerNo: '',
                originatorCustomerName: '',
                originatorBankCode: '',
                internalData: {
                    recipientAccountID: viewAccount.id,
                    recipientAccountType: "bank_account",
                    recipientName: viewAccount.account_holder_name,
                    bankID: viewAccount.bank.id,
                    TransferType: "manual",
                    TransactionType: "transfer_out"
                }
            });
            setTransferResult({ success: true, message: 'Transfer berhasil!' });
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                router.replace({
                    pathname: '/receipt', params: {
                        account: JSON.stringify(viewAccount),
                        data: JSON.stringify(response?.data.data),
                        amount: cleanAmount,
                        note: tempNote,
                        result: 'success',
                        transferResponse: JSON.stringify(response?.data.data),
                    }
                });
            }, 1000);
        } catch (err: any) {
            setTransferResult({ success: false, message: 'Transfer gagal' });
            setShowErrorModal(true);
        } finally {
            setIsTransferring(false);
        }
    };

    useEffect(() => {
        if (statusCode === 401) {
            // If unauthorized, clear JWT and redirect to sign-in in 5 seconds
            setTimeout(() => {
                router.replace('/signin');
            }, 1000);
        }
    }, [statusCode]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
            <VerifyPinModal visible={showVerifyPin} callback={handlePinVerified} onClose={() => setShowVerifyPin(false)} />
            {showSuccessModal && (
                <View style={{ position: 'absolute', zIndex: 9999, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', justifyContent: 'center', minWidth: 200 }}>
                        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                            <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#C7EECF" />
                            <Path d="M8 12.5L11 15.5L16 10.5" stroke="#1B5E20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <Text style={{ fontSize: 18, color: '#178AFF', fontWeight: 'bold', marginTop: 12 }}>{t('transfer_success')}</Text>
                    </View>
                </View>
            )}
            <Modal
                visible={statusCode === 401}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, color: '#C81C4D', fontWeight: 'bold', marginBottom: 8 }}>{t('session_expired_title')}</Text>
                        <Text style={{ color: '#222', fontSize: 16, textAlign: 'center' }}>{t('session_expired_message')}</Text>
                    </View>
                </View>
            </Modal>
            <GestureHandlerRootView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
                    <View style={styles.searchBarWrapper}>
                        <View style={styles.searchBar}>
                            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                                <Path d="M21 21L15.8 15.8M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z" stroke="#BFC6D1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('search_account_placeholder')}
                                placeholderTextColor="#BFC6D1"
                                value={search}
                                onChangeText={handleSearchChange}
                            />
                        </View>
                        <TouchableOpacity onPress={Keyboard.dismiss}>
                            <Text style={styles.cancelText}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.sectionTitle}>{t('saved_accounts')}</Text>
                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 48 }}>
                            <Text style={{ color: '#888', textAlign: 'center', fontSize: 16 }}>{t('loading')}</Text>
                        </View>
                    ) : error ? (
                        <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
                    ) : filteredAccounts.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 48 }}>
                            <Text style={{ color: '#888', textAlign: 'center', fontSize: 16 }}>{t('no_saved_accounts')}</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredAccounts}
                            keyExtractor={item => item.id?.toString() || item.account_number}
                            contentContainerStyle={{ paddingHorizontal: 8 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => setViewAccount(item)}>
                                    <View style={styles.accountCard}>
                                        <View style={styles.avatar} >
                                            {Logos[item.bank?.bank_code] || <View style={{ width: 44, height: 44, backgroundColor: '#E2E8F0', borderRadius: 8 }} />}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.accountName}>{item.account_holder_name}</Text>
                                            <Text style={styles.accountBank}>{item.bank?.bank_name}</Text>
                                            <Text style={styles.accountNumber}>{item.account_number}</Text>
                                            {item.note ? <Text style={{}}>{item.note}</Text> : null}
                                        </View>
                                        <TouchableOpacity>
                                            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                                                <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke="#BFC6D1" strokeWidth={2} strokeLinejoin="round" fill={item.favorite ? '#FFD700' : 'none'} />
                                            </Svg>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    <TouchableOpacity style={styles.fab} onPress={() => setShowSheet(true)}>
                        <Text style={styles.fabText}>+</Text>
                    </TouchableOpacity>
                    {
                        viewAccount && (
                            <TransferRekeningSheet
                                visible={!!viewAccount}
                                account={viewAccount}
                                editAmount={editAmount}
                                setEditAmount={setEditAmount}
                                tempAmount={tempAmount}
                                setTempAmount={setTempAmount}
                                editNote={editNote}
                                setEditNote={setEditNote}
                                tempNote={tempNote}
                                setTempNote={setTempNote}
                                onClose={() => setViewAccount(null)}
                                onTransfer={() => setShowVerifyPin(true)}
                            />)
                    }
                    {/* Error Modal */}
                    <Modal visible={!!(showErrorModal && transferResult && !transferResult.success)} transparent animationType="fade">
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', justifyContent: 'center', minWidth: 200 }}>
                                <Text style={{ fontSize: 16, color: '#C81C4D', fontWeight: 'bold', marginBottom: 12 }}>{transferResult?.message}</Text>
                                <Button title={t('close')} onPress={() => setShowErrorModal(false)} />
                            </View>
                        </View>
                    </Modal>
                    {showSheet && (
                        <BottomSheet
                            ref={bottomSheetRef}
                            onChange={handleSheetChanges}
                            snapPoints={snapPoints}
                            enablePanDownToClose
                            onClose={() => setShowSheet(false)}
                            enableDynamicSizing={false}
                        >
                            {selectedBank ? (
                                <AccountNumberInputSheet
                                    bank={selectedBank}
                                    accountNumber={accountNumber}
                                    setAccountNumber={setAccountNumber}
                                    onBack={handleBack}
                                    onKeypad={handleKeypad}
                                    onDelete={handleDelete}
                                    onAccountSaved={handleAccountSaved}
                                />
                            ) : (
                                <BankListSheet
                                    onBankPress={handleBankPress}
                                />
                            )}
                        </BottomSheet>
                    )}
                </View>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: '#fff',
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingBottom: 0,
        backgroundColor: '#EFEFEF',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 12,
        height: 36,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 12,
        marginLeft: 8,
        color: '#222',
    },
    cancelText: {
        color: '#1976D2',
        fontSize: 15,
        fontWeight: '500',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#444',
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 16,
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 8,
        marginRight: 14,
    },
    accountName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#222',
    },
    accountBank: {
        fontSize: 13,
        color: '#444',
        marginTop: 2,
    },
    accountNumber: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    fabText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: -2,
    },
    sheetHeader: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
    },
    dragIndicator: {
        width: 48,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D9D9D9',
        alignSelf: 'center',
        marginBottom: 12,
    },
    sheetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
    sheetSearchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: 18,
        paddingHorizontal: 12,
        height: 36,
        margin: 16,
    },
    sheetSearchInput: {
        flex: 1,
        fontSize: 12,
        marginLeft: 8,
        color: '#222',
    },
    sheetSectionTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#444',
        marginLeft: 16,
        marginTop: 8,
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    bankLogoPlaceholder: {
        width: 48,
        height: 48,
        marginRight: 16,
        borderRadius: 10,
        backgroundColor: '#D9D9D9',
    },
    bankName: {
        fontSize: 14,
        color: '#222',
    },
    keypadKey: {
        flex: 1,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    keypadKeyText: {
        fontSize: 28,
        color: '#222',
        fontWeight: 'bold',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#178AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
        maxWidth: '80%'
    },
});
