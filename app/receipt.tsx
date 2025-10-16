import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function ReceiptScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    let account, amount, note, result, referenceNo, trxId, transferResponse, data;
    try {
        account = params.account ? JSON.parse(params.account as string) : {};
    } catch {
        account = {};
    }
    amount = params.amount || '';
    note = params.note || '';
    result = params.result || 'success';
    data = params.data ? JSON.parse(params.data as string) : null;
    // Accept transfer response as JSON string param if available
    try {
        transferResponse = params.transferResponse ? JSON.parse(params.transferResponse as string) : null;
    } catch {
        transferResponse = null;
    }

    // Check if this is a virtual account transfer
    const isVirtualAccountTransfer = transferResponse?.data?.virtualAccountData || account?.virtualAccountNo;

    // Prefer transfer response data if available
    if (isVirtualAccountTransfer && transferResponse?.data?.virtualAccountData) {
        // Virtual Account Transfer Response Data
        const vaData = transferResponse.data.virtualAccountData;
        referenceNo = vaData.partnerReferenceNo || '-';
        trxId = vaData.paymentRequestId || '-';
        const provider = 'Virtual Account Transfer';
        const vaNumber = vaData.virtualAccountNo?.trim() || '-';
        const name = vaData.virtualAccountName || '-';
        const bankMasked = transferResponse?.bankMasked || 'Virtual Account';
        const fee = 'Gratis';
        const total = vaData.paidAmount?.value || amount;
        const transactionDate = vaData.trxDateTime;
    } else {
        // Regular Transfer Response Data
        referenceNo = data?.referenceNo || params.referenceNo || account.referenceNo || '-';
        trxId = data?.partnerReferenceNo || params.partnerReferenceNo || account.partnerReferenceNo || '-';
        const provider = transferResponse?.provider || account.provider || account.bank?.bank_name || '-';
        const vaNumber = transferResponse?.account_number || account.account_number || '-';
        const name = transferResponse?.account_holder_name || account.account_holder_name || '-';
        const bankMasked = transferResponse?.bankMasked || (account.bank?.bank_name ? `${account.bank.bank_name} - ••••••••${(data?.sourceAccountNo || '').slice(-4)}` : '-');
        const fee = transferResponse?.fee || 'Gratis';
        const total = amount;
    }

    // Extract data for display (reassign for compatibility)
    const vaData = isVirtualAccountTransfer && transferResponse?.data?.virtualAccountData ? transferResponse.data.virtualAccountData : null;
    referenceNo = vaData?.partnerReferenceNo || data?.referenceNo || params.referenceNo || account.referenceNo || '-';
    trxId = vaData?.paymentRequestId || data?.partnerReferenceNo || params.partnerReferenceNo || account.partnerReferenceNo || '-';
    const provider = isVirtualAccountTransfer ? 'Virtual Account Transfer' : (transferResponse?.provider || account.provider || account.bank?.bank_name || '-');
    const vaNumber = vaData?.virtualAccountNo?.trim() || transferResponse?.account_number || account.account_number || '-';
    const name = vaData?.virtualAccountName || transferResponse?.account_holder_name || account.account_holder_name || '-';
    const bankMasked = transferResponse?.bankMasked || (account.bank?.bank_name ? `${account.bank.bank_name} - ••••••••${(data?.sourceAccountNo || '').slice(-4)}` : '-');
    const fee = transferResponse?.fee || 'Gratis';
    const total = vaData?.paidAmount?.value || amount;
    const targetPixelCount = 1080; // Target width in pixels for the receipt image
    const pixelRatio = PixelRatio.get();
    const pixels = targetPixelCount / pixelRatio;
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                setUser(user);
            }
        };

        getUserInfo();
    }, []);

    // Handle back navigation - navigate to home screen
    useEffect(() => {
        const handleBackPress = () => {
            router.replace('/');
            return true; // Prevent default back behavior
        };

        // Add back handler
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup function
        return () => {
            backHandler.remove();
        };
    }, [router]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View collapsable={false} style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                        {/* Provider Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Penyedia Jasa</Text>
                            <Text style={styles.provider}>{provider}</Text>
                            <Text style={styles.providerSub}>{vaNumber} - {name}</Text>
                            <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                        </View>
                        {/* Payment Detail */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Detail Pembayaran</Text>
                            <View style={styles.rowBetween}>
                                <Text style={styles.detailLabel}>Nominal Transaksi</Text>
                                <Text style={styles.detailValue}>Rp {Number(amount).toLocaleString('id-ID')}</Text>
                            </View>
                            <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />
                            <View style={styles.rowBetween}>
                                <Text style={styles.detailLabel}>Biaya Transaksi</Text>
                                <Text style={styles.detailValue}>{fee}</Text>
                            </View>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: "#000" }} />
                            <View style={styles.rowBetween}>
                                <Text style={[styles.detailLabel, { fontWeight: 'bold', color: "#000" }]}>Total Transaksi</Text>
                                <Text style={[styles.detailValue, { fontWeight: 'bold', color: "#000" }]}>Rp {Number(total).toLocaleString('id-ID')}</Text>
                            </View>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: "#000" }} />
                        </View>
                        {/* Source Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Sumber Dana</Text>
                            <Text style={styles.sourceName}>{user?.full_name || 'ALIF FIRDI'}</Text>
                            <Text style={styles.sourceBank}>{bankMasked}</Text>
                        </View>
                        <View style={styles.divider} />
                        {/* Transaction Detail */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Detail Transaksi</Text>
                            <View style={{ flex: 1, flexDirection: 'column', gap: 12 }}>
                                {isVirtualAccountTransfer ? (
                                    <>
                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>NOMOR VA</Text>
                                            <Text style={styles.detailValue}>{vaNumber}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>NAMA</Text>
                                            <Text style={styles.detailValue}>{name}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>PARTNER SERVICE ID</Text>
                                            <Text style={styles.detailValue}>{vaData?.partnerServiceId?.trim() || '-'}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>CUSTOMER NO</Text>
                                            <Text style={styles.detailValue}>{vaData?.customerNo || '-'}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>REFERENCE NO</Text>
                                            <Text style={styles.detailValue}>{referenceNo}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>PAYMENT REQUEST ID</Text>
                                            <Text style={styles.detailValue}>{trxId}</Text>

                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>TRX DATE TIME</Text>
                                            <Text style={styles.detailValue}>{vaData?.trxDateTime || '-'}</Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>NOMOR VA</Text>
                                            <Text style={styles.detailValue}>{vaNumber}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>NAMA</Text>
                                            <Text style={styles.detailValue}>{name}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>REFERENCE NO</Text>
                                            <Text style={styles.detailValue}>{referenceNo}</Text>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.detailLabel}>TRX ID</Text>
                                            <Text style={styles.detailValue}>{trxId}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                                <Path d="M17 8.5V7C17 5.89543 16.1046 5 15 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H15C16.1046 19 17 18.1046 17 17V15.5" stroke="#1976D2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                <Path d="M21 12L17 8.5V11H9V13H17V15.5L21 12Z" fill="#1976D2" />
                            </Svg>
                            <Text style={styles.actionText}>Bagikan Resi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                                <Path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="#1976D2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                <Path d="M5 19H19" stroke="#1976D2" strokeWidth={2} strokeLinecap="round" />
                            </Svg>
                            <Text style={styles.actionText}>Download</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001F3F',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        backgroundColor: '#fff',
        padding: 24,
        paddingHorizontal: 36,
        flexDirection: 'column',
        gap: 12,
    },
    sectionLabel: {
        color: '#BFC6D1',
        fontSize: 13,
        marginBottom: 2,
    },
    provider: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#222',
        marginBottom: 2,
    },
    providerSub: {
        color: '#888',
        fontSize: 13,
        marginBottom: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F2',
        marginVertical: 2,
    },
    bottomDivider: {
        height: 8,
        backgroundColor: '#F2F2F2',
        marginVertical: 18,
        borderRadius: 4,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    detailLabel: {
        color: '#888',
        fontSize: 14,
        flexShrink: 0,
        marginRight: 8,
    },
    detailValue: {
        color: '#222',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
        flexWrap: 'wrap',
    },
    sourceName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222',
        marginBottom: 2,
    },
    sourceBank: {
        color: '#888',
        fontSize: 13,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F2F2F2',
        marginHorizontal: 4,
    },
    actionText: {
        color: '#1976D2',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    },
});
