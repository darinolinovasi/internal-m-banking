import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface VirtualAccountAmountInputModalProps {
    visible: boolean;
    virtualAccountData: any;
    onClose: () => void;
    onConfirm: (amount: string) => void;
}

export default function VirtualAccountAmountInputModal({
    visible,
    virtualAccountData,
    onClose,
    onConfirm
}: VirtualAccountAmountInputModalProps) {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const handleAmountChange = (value: string) => {
        // Only allow numbers and one decimal point
        const sanitized = value.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        const parts = sanitized.split('.');
        const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
        setAmount(formatted);
        setError(null);
    };

    const handleConfirm = () => {
        if (!amount || amount.trim() === '') {
            setError(t('amount_required', 'Amount is required'));
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError(t('invalid_amount', 'Please enter a valid amount'));
            return;
        }

        if (numAmount < 10000) {
            setError(t('minimum_amount', 'Minimum amount is Rp 10,000'));
            return;
        }

        console.log(amount)
        onConfirm(amount);
    };

    const formatAmount = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '';
        return `Rp ${numValue.toLocaleString('id-ID')}`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.overlayContent}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <View style={[styles.modalContainer, keyboardVisible && styles.modalContainerKeyboard]}>
                                    {/* Header */}
                                    <View style={styles.header}>
                                        <View style={styles.iconContainer}>
                                            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <Path
                                                    d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm5.707 10.707l-7 7a.997.997 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L14 17.586l6.293-6.293a1 1 0 011.414 1.414z"
                                                    fill="#4CAF50"
                                                />
                                            </Svg>
                                        </View>
                                        <Text style={styles.title}>{t('enter_amount', 'Enter Amount')}</Text>
                                        <Text style={styles.subtitle}>
                                            {t('amount_required_message', 'Please enter the amount you want to pay')}
                                        </Text>
                                    </View>

                                    {/* Virtual Account Info */}
                                    <View style={styles.infoContainer}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>{t('virtual_account_name', 'Virtual Account Name')}</Text>
                                            <Text style={styles.infoValue}>{virtualAccountData?.virtualAccountName || '-'}</Text>
                                        </View>

                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>{t('virtual_account_number', 'Virtual Account Number')}</Text>
                                            <Text style={styles.infoValue}>{virtualAccountData?.virtualAccountNo?.trim() || '-'}</Text>
                                        </View>
                                    </View>

                                    {/* Amount Input */}
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>{t('amount', 'Amount')}</Text>
                                        <View style={styles.inputFieldContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Text style={styles.currencySymbol}>Rp</Text>
                                                <TextInput
                                                    style={styles.amountInput}
                                                    placeholder="0"
                                                    placeholderTextColor="#BFC6D1"
                                                    value={amount}
                                                    onChangeText={handleAmountChange}
                                                    keyboardType="numeric"
                                                    autoFocus
                                                />
                                            </View>
                                        </View>
                                        {amount && (
                                            <Text style={styles.formattedAmount}>{formatAmount(amount)}</Text>
                                        )}
                                        {error && (
                                            <Text style={styles.errorText}>{error}</Text>
                                        )}
                                    </View>

                                    {/* Action Buttons */}
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                            <Text style={styles.cancelButtonText}>{t('cancel', 'Cancel')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.confirmButton, (!amount || parseFloat(amount) < 10000) && styles.confirmButtonDisabled]}
                                            onPress={handleConfirm}
                                            disabled={!amount || parseFloat(amount) < 10000}
                                        >
                                            <Text style={styles.confirmButtonText}>{t('confirm', 'Confirm')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: '100%',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '90%',
        marginVertical: 20,
        overflow: 'hidden',
    },
    modalContainerKeyboard: {
        maxHeight: '70%',
        marginVertical: 10,
    },
    header: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F5E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    infoContainer: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 16,
    },
    infoValue: {
        fontSize: 14,
        color: '#222',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    inputContainer: {
        padding: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 12,
    },
    inputFieldContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        minHeight: 48,
        width: '100%',
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        padding: 0,
        textAlign: 'right',
        minHeight: 24,
    },
    formattedAmount: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#EF4444',
        marginTop: 8,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FAFAFA',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#178AFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#178AFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    confirmButtonDisabled: {
        backgroundColor: '#A0CFFF',
        shadowOpacity: 0.1,
    },
});
