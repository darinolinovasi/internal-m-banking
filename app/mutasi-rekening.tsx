import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const mutasiData = [
    {
        status: 'PEND',
        date: '02',
        month: 'Okt',
        year: '2025',
        title: 'Payment to Warung Ikan Bakar 2',
        desc: 'Transaksi Kredit',
        amount: 'IDR 5.000.000,00',
        amountColor: '#D32F2F',
        statusColor: '#222',
    },
    {
        date: '02',
        month: 'Okt',
        year: '2025',
        title: 'Payment to Warung Ikan Bakar 3',
        desc: 'Transaksi Debit',
        amount: 'IDR 5.000.000,00',
        amountColor: '#D32F2F',
    },
    {
        date: '02',
        month: 'Okt',
        year: '2025',
        title: 'Payment to Warung Ikan Bakar 3',
        desc: 'Trx Masuk',
        amount: 'IDR 5.000.000,00',
        amountColor: '#1976D2',
    },
];

export default function MutasiRekeningScreen() {
    const { t } = useTranslation();
    const [showPicker, setShowPicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | null | undefined>(undefined);

    let minDate, maxDate;
    if (startDate) {
        minDate = startDate;
        maxDate = moment(startDate).add(30, 'days').toDate();
    }

    const onDateChange = (date: any, type: any) => {
        if (type === 'END_DATE') {
            if (startDate && date) {
                // If end date is before start date, make picked date as new start date
                if ((date as Date).getTime() < (startDate as Date).getTime()) {
                    setStartDate(date);
                    setEndDate(null);
                    return;
                }
                // Only allow max 30 days range
                const diff = Math.abs((date as Date).getTime() - (startDate as Date).getTime());
                const diffDays = diff / (1000 * 60 * 60 * 24);
                if (diffDays > 30) {
                    setEndDate(undefined);
                    return;
                }
            }
            setEndDate(date);
            return;
        }
        if (startDate && endDate) {
            // If picked date is not before start date, make it new end date
            if ((date as Date).getTime() >= (startDate as Date).getTime()) {
                setEndDate(date);
                return;
            }
            // If picked date is before start date, make it new start date and clear end date
            setStartDate(date);
            setEndDate(null);
            return;
        } else if (startDate) {
            // If user picks start date again, cancel state
            setStartDate(undefined);
            setEndDate(undefined);
            return;
        }
        setStartDate(date);
        setEndDate(null);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
            {/* Date Range Picker Modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>{t('select_date_range')}</Text>
                        <CalendarPicker
                            startFromMonday={true}
                            allowRangeSelection={true}
                            selectedStartDate={startDate}
                            selectedEndDate={endDate || undefined}
                            onDateChange={onDateChange}
                            width={320}
                            selectedRangeStyle={{ backgroundColor: '#1976D2' }}
                            selectedDayColor={'#1976D2'}
                            selectedDayTextColor={'#fff'}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <TouchableOpacity onPress={() => setShowPicker(false)} style={{ marginRight: 16 }}>
                                <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>{t('choose')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('mutasi_rekening')}</Text>
                <View style={styles.searchRow}>
                    <View style={styles.searchBox}>
                        <Svg width={18} height={18} viewBox="0 0 23 23" fill="none">
                            <Path d="M21.2111 23L13.1611 14.95C12.5222 15.4611 11.7875 15.8657 10.9569 16.1639C10.1264 16.462 9.24259 16.6111 8.30556 16.6111C5.98426 16.6111 4.01989 15.807 2.41245 14.1987C0.805001 12.5904 0.000852528 10.626 6.76073e-07 8.30556C-0.000851176 5.98511 0.803297 4.02074 2.41245 2.41244C4.02159 0.804148 5.98596 0 8.30556 0C10.6251 0 12.5899 0.804148 14.1999 2.41244C15.8099 4.02074 16.6137 5.98511 16.6111 8.30556C16.6111 9.24259 16.462 10.1264 16.1639 10.9569C15.8657 11.7875 15.4611 12.5222 14.95 13.1611L23 21.2111L21.2111 23ZM8.30556 14.0556C9.90278 14.0556 11.2606 13.4967 12.3791 12.3791C13.4976 11.2615 14.0564 9.90363 14.0556 8.30556C14.0547 6.70748 13.4959 5.35006 12.3791 4.23328C11.2623 3.1165 9.90448 2.55726 8.30556 2.55556C6.70663 2.55385 5.3492 3.11309 4.23328 4.23328C3.11735 5.35346 2.55811 6.71089 2.55556 8.30556C2.553 9.90022 3.11224 11.2581 4.23328 12.3791C5.35432 13.5001 6.71174 14.059 8.30556 14.0556Z" fill="#BDBDBD" />
                        </Svg>
                        <TextInput
                            placeholder={t('search')}
                            placeholderTextColor="#BDBDBD"
                            style={styles.searchInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowPicker(true)}>
                        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <Path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 5.25C3.5 4.78587 3.68437 4.34075 4.01256 4.01256C4.34075 3.68437 4.78587 3.5 5.25 3.5H22.75C23.2141 3.5 23.6592 3.68437 23.9874 4.01256C24.3156 4.34075 24.5 4.78587 24.5 5.25V7.68367C24.4999 8.30245 24.2539 8.89585 23.8163 9.33333L17.5 15.6497V24.311C17.5 24.5298 17.4441 24.7449 17.3376 24.936C17.2311 25.1271 17.0775 25.2878 16.8914 25.4028C16.7053 25.5179 16.4929 25.5834 16.2743 25.5932C16.0558 25.6031 15.8383 25.5569 15.6427 25.459L11.3062 23.2913C11.0639 23.1702 10.8602 22.984 10.7178 22.7537C10.5754 22.5233 10.5 22.2578 10.5 21.987V15.6497L4.18367 9.33333C3.74605 8.89585 3.50013 8.30245 3.5 7.68367V5.25ZM5.83333 5.83333V7.68367L12.32 14.1703C12.4827 14.3328 12.6118 14.5258 12.6998 14.7382C12.7879 14.9506 12.8333 15.1782 12.8333 15.4082V21.4457L15.1667 22.6123V15.4082C15.1667 14.9438 15.351 14.4982 15.68 14.1715L22.1667 7.6825V5.83333H5.83333Z" fill="#D0D0D0" />
                        </Svg>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {mutasiData.map((item, idx) => (
                    <View key={idx} style={styles.card}>
                        {item.status ? (
                            <View style={styles.statusCol}>
                                <Text style={[styles.statusText, { color: item.statusColor || '#222' }]}>PEND</Text>
                            </View>
                        ) : (
                            <View style={styles.dateCol}>
                                <Text style={styles.dateDay}>{item.date}</Text>
                                <Text style={styles.dateMonth}>{item.month}</Text>
                                <Text style={styles.dateYear}>{item.year}</Text>
                            </View>
                        )}
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc}>{item.desc}</Text>
                            <Text style={[styles.cardAmount, { color: item.amountColor }]}>{item.amount}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#222',
        marginBottom: 12,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        height: 40,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#222',
        marginLeft: 8,
    },
    filterBtn: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    content: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    statusCol: {
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    statusText: {
        fontWeight: '700',
        fontSize: 16,
    },
    dateCol: {
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    dateDay: {
        fontWeight: '700',
        fontSize: 18,
        color: '#222',
        lineHeight: 20,
    },
    dateMonth: {
        fontSize: 13,
        color: '#222',
        fontWeight: '600',
        lineHeight: 16,
    },
    dateYear: {
        fontSize: 10,
        color: '#222',
        fontWeight: '400',
        lineHeight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 15,
        color: '#222',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 13,
        color: '#222',
        fontWeight: '500',
        marginBottom: 4,
    },
    cardAmount: {
        fontWeight: '700',
        fontSize: 15,
    },
});
