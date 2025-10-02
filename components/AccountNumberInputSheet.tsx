import { useInquiry } from '@/hooks/use-inquiry';
import * as Clipboard from 'expo-clipboard';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Polyline, Rect } from 'react-native-svg';
import AccountSuccessSheet from './AccountSuccessSheet';
import PinKeypad from './PinKeypad';

interface AccountNumberInputSheetProps {
    bank: { id: number, bank_code: string; bank_name: string };
    accountNumber: string;
    setAccountNumber: (val: string) => void;
    onBack: () => void;
    onKeypad: (val: string) => void;
    onDelete: () => void;
    onAccountSaved?: () => void;
}

export default function AccountNumberInputSheet({ bank, accountNumber, setAccountNumber, onBack, onKeypad, onDelete, onAccountSaved }: AccountNumberInputSheetProps) {
    const [error, setError] = useState<string | null>("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const { inquiry, loading, error: inquiryError } = useInquiry();
    const [successData, setSuccessData] = useState<any>(null);

    // Remove doInquiry, use this instead:
    const handleInquiry = async () => {
        try {
            const response = await inquiry(bank, accountNumber);
            if (response.status === 200) {
                setSuccessData(response.data.data);
                setShowSuccess(true);
            } else {
                // fallback error
                setError('Nomor rekening tidak ditemukan.');
            }
        } catch (err) {
            // error handled by hook
        }
    };

    // Handle paste or manual input
    const handleInputChange = (val: string) => {
        // Only allow numbers, max 16 digits
        const sanitized = val.replace(/[^0-9]/g, '').slice(0, 16);
        setAccountNumber(sanitized);
    };

    const handlePaste = async () => {
        const text = await Clipboard.getStringAsync();
        // Only allow numbers, max 16 digits
        const sanitized = text.replace(/[^0-9]/g, '').slice(0, 16);
        setAccountNumber(sanitized);
    };

    // When keypad is used, blur the input so keypad is visible
    const handleKeypadPress = (val: string) => {
        if (inputFocused) {
            inputRef.current?.blur();
        }
        onKeypad(val);
    };
    const handleDeletePress = () => {
        if (inputFocused) {
            inputRef.current?.blur();
        }
        onDelete();
    };

    if (showSuccess) {
        return (
            <AccountSuccessSheet
                bank={bank}
                accountData={successData}
                note={'Rekening payroll'}
                onBack={() => setShowSuccess(false)}
                onAccountSaved={onAccountSaved}
            />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* <VerifyPinModal visible={pinModalVisible} callback={handleInquiry} /> */}
            <View style={{ flex: 1, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
                        <Svg width="24" height="24" viewBox="0 0 40 40" fill="none" >
                            <Path d="M20 0.5C9.23094 0.5 0.5 9.23094 0.5 20C0.5 30.7691 9.23094 39.5 20 39.5C30.7691 39.5 39.5 30.7691 39.5 20C39.5 9.23094 30.7691 0.5 20 0.5ZM25.8716 29L23.75 31.1216L12.6284 20L23.75 8.87844L25.8716 11L16.8716 20L25.8716 29Z" fill="#050505" />
                        </Svg>

                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Masukkan Rekening Tujuan</Text>
                </View>
                <View style={{ marginBottom: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                            <View style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: '#D9D9D9', marginRight: 16 }} />
                            <Text style={{ fontWeight: '500', fontSize: 16 }}>{bank.bank_name}</Text>
                        </View>
                        <View style={{ borderTopWidth: 1, borderColor: '#E0E0E0' }} />
                        <View style={{ padding: 16 }}>
                            <Text style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Nomor Rekening / Virtual Account</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TextInput
                                    ref={inputRef}
                                    style={[styles.accountNumberInput, { backgroundColor: '#F5F5F5' }]}
                                    value={accountNumber}
                                    onChangeText={handleInputChange}
                                    placeholderTextColor="#BFC6D1"
                                    maxLength={16}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={false} // Make input disabled
                                    selectTextOnFocus={false} // Prevent selection
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                />
                                <TouchableOpacity onPress={handlePaste}>
                                    <Svg width={24} height={24} viewBox="0 0 32 32" enable-background="new 0 0 32 32" >
                                        <Path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" d="M17,6c0-1.1-0.9-2-2-2s-2,0.9-2,2h-3v4h10V6H17z" />
                                        <Polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="10,6 6,6 6,27 14,27 " />
                                        <Polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="24,15 24,6 20,6 " />
                                        <Rect x="14" y="15" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" width="12" height="14" />
                                    </Svg>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* Error Message: only show if error exists */}
                    {(error || inquiryError) && (
                        <View style={{ position: "relative", alignItems: "center", display: "flex", justifyContent: 'center', flexDirection: "row", gap: 4, alignContent: 'center', paddingHorizontal: 16, paddingTop: 32, paddingBottom: 16, backgroundColor: '#FEE8EF', borderBottomStartRadius: 18, borderBottomEndRadius: 18, top: -18, zIndex: -1 }}>
                            <Svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                <Path d="M0.75 15.75H17.25L9 1.5L0.75 15.75ZM9.75 13.5H8.25V12H9.75V13.5ZM9.75 10.5H8.25V7.5H9.75V10.5Z" fill="#C81C4D" />
                            </Svg>
                            <Text style={{ color: "#831F3A", fontSize: 14 }}>{error || inquiryError}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleInquiry}>
                    <Text style={styles.submitButtonText}>Konfirmasi</Text>
                </TouchableOpacity>
            </View>
            {/* Show keypad only when input is not focused */}
            {!inputFocused && (
                <View style={{ boxShadow: '0 -0.5px 1px rgba(0,0,0,0.1)' }}>
                    <PinKeypad onPress={handleKeypadPress} onDelete={handleDeletePress} />
                </View>
            )}
        </View >
    );
}

const styles = StyleSheet.create({
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
    accountNumberInput: {
        fontSize: 20,
        fontWeight: '500',
        color: '#222',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 2,
        width: '90%',
    },
    accountNumberInputBox: {
        fontSize: 20,
        fontWeight: '500',
        color: '#222',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 2,
        width: '100%',
        letterSpacing: 2,
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#178AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
