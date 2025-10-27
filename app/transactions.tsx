import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTransfersWithTransactions } from '../hooks/use-transfer';

export default function TransactionsScreen() {
    const router = useRouter()
    const { t } = useTranslation();
    const { transfers, loading, error, refetch, loadMore, hasMore } = useTransfersWithTransactions();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t('transaction_history')}</Text>
                    <View style={styles.searchBox}>
                        <Svg width="18" height="18" viewBox="0 0 23 23" fill="none">
                            <Path d="M21.2111 23L13.1611 14.95C12.5222 15.4611 11.7875 15.8657 10.9569 16.1639C10.1264 16.462 9.24259 16.6111 8.30556 16.6111C5.98426 16.6111 4.01989 15.807 2.41245 14.1987C0.805001 12.5904 0.000852528 10.626 6.76073e-07 8.30556C-0.000851176 5.98511 0.803297 4.02074 2.41245 2.41244C4.02159 0.804148 5.98596 0 8.30556 0C10.6251 0 12.5899 0.804148 14.1999 2.41244C15.8099 4.02074 16.6137 5.98511 16.6111 8.30556C16.6111 9.24259 16.462 10.1264 16.1639 10.9569C15.8657 11.7875 15.4611 12.5222 14.95 13.1611L23 21.2111L21.2111 23ZM8.30556 14.0556C9.90278 14.0556 11.2606 13.4967 12.3791 12.3791C13.4976 11.2615 14.0564 9.90363 14.0556 8.30556C14.0547 6.70748 13.4959 5.35006 12.3791 4.23328C11.2623 3.1165 9.90448 2.55726 8.30556 2.55556C6.70663 2.55385 5.3492 3.11309 4.23328 4.23328C3.11735 5.35346 2.55811 6.71089 2.55556 8.30556C2.553 9.90022 3.11224 11.2581 4.23328 12.3791C5.35432 13.5001 6.71174 14.059 8.30556 14.0556Z" fill="#D1D1D1" />
                        </Svg>
                        <TextInput
                            placeholder={t('search_bank_placeholder')}
                            placeholderTextColor="#BDBDBD"
                            style={styles.searchInput}
                        />
                    </View>
                </View>
                {/* Content */}
                <FlatList
                    data={transfers}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item: transfer }) => (
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '/receipt',
                                params: {
                                    referenceNo: transfer.transaction_ref
                                }
                            })
                        }}>
                            <View style={styles.card}>
                                <View style={styles.cardLeft}>
                                    <Text style={styles.cardName}>{transfer.recipient_name}</Text>

                                    <Text style={styles.cardBank}>{t('bank_transfer')}</Text>

                                    <Text style={{ fontSize: 12, color: '#888' }}>{transfer.note}</Text>
                                </View>
                                <View style={styles.cardRight}>
                                    <Text style={styles.cardAmount}>IDR {Number(transfer.amount).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</Text>
                                    <Text style={styles.cardStatus}>{transfer.status}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListHeaderComponent={<Text style={styles.sectionTitle}>{t('previous_transactions')}</Text>}
                    ListFooterComponent={loading ? <Text style={{ margin: 16 }}>{t('loading')}</Text> : null}
                    onEndReached={hasMore ? loadMore : null}
                    onEndReachedThreshold={0.2}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#222',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        height: 40,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    searchIcon: {
        fontSize: 18,
        color: '#BDBDBD',
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#222',
    },
    content: {
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: '#F6F6F6',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#222',
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 8,
    },
    dateLabel: {
        fontSize: 13,
        color: '#888',
        marginTop: 12,
        marginBottom: 4,
        fontWeight: '500',
        marginLeft: 8,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ECECEC',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 2
    },
    cardLeft: {
        flex: 1,
    },
    cardName: {
        fontWeight: '700',
        fontSize: 15,
        color: '#222',
        marginBottom: 2,
    },
    cardBank: {
        color: '#178AFF',
        fontSize: 13,
        fontWeight: '500',
    },
    cardRight: {
        alignItems: 'flex-end',
        minWidth: 110,
    },
    cardAmount: {
        fontWeight: '700',
        fontSize: 15,
        color: '#06224A',
    },
    cardStatus: {
        color: '#BDBDBD',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
});
