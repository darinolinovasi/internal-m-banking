import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TransferRekeningSheetProps {
    visible: boolean;
    account: any;
    editAmount: boolean;
    setEditAmount: (v: boolean) => void;
    tempAmount: string;
    setTempAmount: (v: string) => void;
    editNote: boolean;
    setEditNote: (v: boolean) => void;
    tempNote: string;
    setTempNote: (v: string) => void;
    onClose: () => void;
    onTransfer: () => void;
}

export default function TransferRekeningSheet({
    visible,
    account,
    editAmount,
    setEditAmount,
    tempAmount,
    setTempAmount,
    editNote,
    setEditNote,
    tempNote,
    setTempNote,
    onClose,
    onTransfer,
}: TransferRekeningSheetProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = ['100%'];
    if (!visible || !account) return null;
    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={onClose}
            enableDynamicSizing={false}
        >
            <View style={{ padding: 0, backgroundColor: '#fff', flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                    <TouchableOpacity onPress={onClose} style={{ marginRight: 8 }}>
                        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                            <Path d="M15 19L8 12L15 5" stroke="#222" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>Transfer ke Rekening</Text>
                </View>
                <View style={{ margin: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E5E5', backgroundColor: '#fff', overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                            <Text style={{ fontWeight: 'bold', color: '#1976D2', fontSize: 16 }}>{account.bank?.bank_code || '🏦'}</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>{account.bank?.bank_name}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#F0F0F0' }} />
                    <View style={{ padding: 16 }}>
                        <Text style={{ color: '#222', fontSize: 13, marginBottom: 2 }}>Nama</Text>
                        <Text style={{ fontWeight: '200', fontSize: 16, marginBottom: 12 }}>{account.account_holder_name}</Text>
                        <Text style={{ color: '#222', fontSize: 13, marginBottom: 2 }}>Nomor Rekening</Text>
                        <Text style={{ fontWeight: '200', fontSize: 16, marginBottom: 12 }}>{account.account_number}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#222', fontSize: 13, marginBottom: 2 }}>Nominal Transfer</Text>
                                {editAmount ? (
                                    <TextInput
                                        style={{ fontWeight: '200', fontSize: 16, borderBottomWidth: 1, borderColor: '#1976D2', padding: 0, margin: 0 }}
                                        value={tempAmount}
                                        onChangeText={setTempAmount}
                                        keyboardType="numeric"
                                        autoFocus
                                        onBlur={() => setEditAmount(false)}
                                    />
                                ) : (
                                    <Text style={{ fontWeight: '200', fontSize: 16 }}>Rp {Number(tempAmount).toLocaleString('id-ID')},00</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => setEditAmount(true)}>
                                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <Path d="M13 3C13.2549 3.00028 13.5 3.09788 13.6854 3.27285C13.8707 3.44782 13.9822 3.68695 13.9972 3.94139C14.0121 4.19584 13.9293 4.44638 13.7657 4.64183C13.6021 4.83729 13.3701 4.9629 13.117 4.993L13 5H5V19H19V11C19.0003 10.7451 19.0979 10.5 19.2728 10.3146C19.4478 10.1293 19.687 10.0178 19.9414 10.0028C20.1958 9.98789 20.4464 10.0707 20.6418 10.2343C20.8373 10.3979 20.9629 10.6299 20.993 10.883L21 11V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H5C4.49542 21.0002 4.00943 20.8096 3.63945 20.4665C3.26947 20.1234 3.04284 19.6532 3.005 19.15L3 19V5C2.99984 4.49542 3.19041 4.00943 3.5335 3.63945C3.87659 3.26947 4.34684 3.04284 4.85 3.005L5 3H13ZM19.243 3.343C19.423 3.16365 19.6644 3.05953 19.9184 3.05177C20.1723 3.04402 20.4197 3.13322 20.6103 3.30125C20.8008 3.46928 20.9203 3.70355 20.9444 3.95647C20.9685 4.2094 20.8954 4.46201 20.74 4.663L20.657 4.758L10.757 14.657C10.577 14.8363 10.3356 14.9405 10.0816 14.9482C9.82767 14.956 9.58029 14.8668 9.38972 14.6988C9.19916 14.5307 9.07969 14.2964 9.0556 14.0435C9.03151 13.7906 9.10459 13.538 9.26 13.337L9.343 13.243L19.243 3.343Z" fill="#666666" />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#222', fontSize: 13, marginBottom: 2 }}>Catatan</Text>
                                {editNote ? (
                                    <TextInput
                                        style={{ fontWeight: '200', fontSize: 16, borderBottomWidth: 1, borderColor: '#1976D2', padding: 0, margin: 0 }}
                                        value={tempNote}
                                        onChangeText={setTempNote}
                                        autoFocus
                                        onBlur={() => setEditNote(false)}
                                    />
                                ) : (
                                    <Text style={{ fontWeight: '200', fontSize: 16 }}>{tempNote}</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => setEditNote(true)}>
                                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <Path d="M13 3C13.2549 3.00028 13.5 3.09788 13.6854 3.27285C13.8707 3.44782 13.9822 3.68695 13.9972 3.94139C14.0121 4.19584 13.9293 4.44638 13.7657 4.64183C13.6021 4.83729 13.3701 4.9629 13.117 4.993L13 5H5V19H19V11C19.0003 10.7451 19.0979 10.5 19.2728 10.3146C19.4478 10.1293 19.687 10.0178 19.9414 10.0028C20.1958 9.98789 20.4464 10.0707 20.6418 10.2343C20.8373 10.3979 20.9629 10.6299 20.993 10.883L21 11V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H5C4.49542 21.0002 4.00943 20.8096 3.63945 20.4665C3.26947 20.1234 3.04284 19.6532 3.005 19.15L3 19V5C2.99984 4.49542 3.19041 4.00943 3.5335 3.63945C3.87659 3.26947 4.34684 3.04284 4.85 3.005L5 3H13ZM19.243 3.343C19.423 3.16365 19.6644 3.05953 19.9184 3.05177C20.1723 3.04402 20.4197 3.13322 20.6103 3.30125C20.8008 3.46928 20.9203 3.70355 20.9444 3.95647C20.9685 4.2094 20.8954 4.46201 20.74 4.663L20.657 4.758L10.757 14.657C10.577 14.8363 10.3356 14.9405 10.0816 14.9482C9.82767 14.956 9.58029 14.8668 9.38972 14.6988C9.19916 14.5307 9.07969 14.2964 9.0556 14.0435C9.03151 13.7906 9.10459 13.538 9.26 13.337L9.343 13.243L19.243 3.343Z" fill="#666666" />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#178AFF', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' }} onPress={onTransfer}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Transfer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
}
