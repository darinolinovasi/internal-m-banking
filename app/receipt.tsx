import { useTransferByReference } from '@/hooks/use-transfer-by-reference';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function ReceiptScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { getTransferByReference, transferData, loading, error } = useTransferByReference();

    // Get referenceNo from URL params
    const referenceNo = params.referenceNo as string;

    // State for user info
    const [user, setUser] = useState<any>(null);
    const hasFetchedData = useRef(false);

    // Fetch user info
    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                setUser(user);
            }
        };

        getUserInfo();
    }, []);

    // Fetch transfer data by reference number - only once on first render
    useEffect(() => {
        const fetchTransferData = async () => {
            if (referenceNo && !hasFetchedData.current) {
                hasFetchedData.current = true;
                await getTransferByReference(referenceNo);
            }
        };

        fetchTransferData();
    }, []); // Empty dependency array - fetch only once on mount

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

    console.log("ASDADSA : ", transferData)

    // Format date to dd-MM-yyyy HH:MM format
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${day}-${month}-${year} ${hours}:${minutes}`;
        } catch (error) {
            return dateString; // Return original if formatting failsG
        }
    };

    // Extract data for display from API response
    const amount = transferData?.amount || '0';
    const note = transferData?.remark || '';
    const result = transferData?.status || 'success';
    const trxId = transferData?.external_ref || '-';
    const provider = transferData?.bank?.bank_name || 'Transfer';
    const vaNumber = transferData?.recipient_account_number || '-';
    const name = transferData?.recipient_name || '-';
    const accountNo = "2000100101"
    const bankMasked = `••••••••${accountNo.slice(-4)}`;
    const fee = transferData?.admin_fee == 0 ? 'Gratis' : transferData?.admin_fee;
    const total = amount;

    // Show loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#1976D2" />
                    <Text style={{ marginTop: 16, color: '#666' }}>Loading transfer details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show error state
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ color: '#D32F2F', fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
                        Failed to load transfer details
                    </Text>
                    <Text style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: '#1976D2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                        onPress={() => router.replace('/')}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Show message if no transfer data
    if (!transferData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ color: '#666', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                        No transfer data found
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: '#1976D2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                        onPress={() => router.replace('/')}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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
                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>ACCOUNT NUMBER</Text>
                                    <Text style={styles.detailValue}>{vaNumber}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>ACCOUNT NAME</Text>
                                    <Text style={styles.detailValue}>{name}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>BANK NAME</Text>
                                    <Text style={styles.detailValue}>{transferData?.bank.bank_name || '-'}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>REFERENCE NO</Text>
                                    <Text style={styles.detailValue}>{transferData?.transaction_ref || '-'}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>PARTNER REFERENCE NO</Text>
                                    <Text style={styles.detailValue}>{trxId}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>STATUS</Text>
                                    <Text style={styles.detailValue}>{transferData?.status || '-'}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#888" }} />

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailLabel}>TRANSACTION DATE</Text>
                                    <Text style={styles.detailValue}>{formatDate(transferData?.created_at)}</Text>
                                </View>
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
