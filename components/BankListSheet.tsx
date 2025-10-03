import { Logos } from '@/assets/logos';
import { useBankCodes } from '@/hooks/use-bank-codes';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import pkg from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
const { debounce } = pkg;

interface BankListSheetProps {
    onBankPress: (bank: any) => void;
}

export default function BankListSheet({ onBankPress }: BankListSheetProps) {
    const { t } = useTranslation();
    const { banks, loading, error } = useBankCodes();
    const [search, setSearch] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState('');
    const debouncedSetSearch = React.useMemo(() => debounce((val: string) => setDebouncedSearch(val), 300), []);
    const handleSearchChange = (val: string) => {
        setSearch(val);
        debouncedSetSearch(val);
    };
    const filteredBanks = banks.filter(b => b.bank_name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{t('select_destination_bank')}</Text>
            </View>
            <View style={styles.sheetSearchBar}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path d="M21 21L15.8 15.8M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z" stroke="#BFC6D1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <TextInput
                    style={styles.sheetSearchInput}
                    placeholder={t('search_bank_placeholder')}
                    placeholderTextColor="#BFC6D1"
                    value={search}
                    onChangeText={handleSearchChange}
                />
            </View>
            <Text style={styles.sheetSectionTitle}>{t('bank_list')}</Text>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 32 }} size="large" color="#178AFF" />
            ) : error ? (
                <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
            ) : (
                <BottomSheetFlatList
                    data={filteredBanks}
                    keyExtractor={(item: any) => item.bank_code}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity onPress={() => onBankPress(item)} style={styles.bankItem}>
                            <View style={styles.bankLogoPlaceholder} >
                                {/* <BcaLogo /> */}
                                {Logos[item.bank_code] || <View style={{ width: 48, height: 48, backgroundColor: '#E2E8F0', borderRadius: 10 }} />}
                            </View>
                            <Text style={styles.bankName}>{item.bank_name}</Text>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F2F2F2', marginLeft: 80 }} />}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 32 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sheetHeader: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
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
    },
    bankName: {
        fontSize: 14,
        color: '#222',
    },
});
