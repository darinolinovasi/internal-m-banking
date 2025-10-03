import { useSaveAccountNumber } from '@/hooks/use-save-account-number';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import VerifyPinModal from './VerifyPinModal';

interface AccountSuccessSheetProps {
    bank: { id: number, bank_name: string; bank_code: string };
    accountData: {
        referenceNo: string;
        beneficiaryAccountName: string;
        beneficiaryAccountNo: string;
        beneficiaryBankCode: string;
        beneficiaryBankName: string;
        isSaved: boolean;
    };
    note: string;
    onBack: () => void;
    onAccountSaved?: () => void;
}

export default function AccountSuccessSheet({ bank, accountData, note, onBack, onAccountSaved }: AccountSuccessSheetProps) {
    const { t } = useTranslation();
    const [editableNote, setEditableNote] = useState(note);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { saveAccountNumber, loading: saving, error: saveError } = useSaveAccountNumber();
    const isAlreadySaved = accountData?.isSaved;

    const handleSaveAccount = async () => {
        try {
            await saveAccountNumber({
                account_number: accountData.beneficiaryAccountNo,
                bank_id: bank.id.toString(),
                account_type: 'bank_account',
                virtual_account_code: '',
                account_holder_name: accountData.beneficiaryAccountName,
                note: note || '',
            });
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                onBack();
            }, 1500);
        } catch (err) {
            // error handled by hook
        } finally {
            setShowPinModal(false);
            onAccountSaved && onAccountSaved();
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
                    <Svg width="24" height="24" viewBox="0 0 40 40" fill="none" >
                        <Path d="M20 0.5C9.23094 0.5 0.5 9.23094 0.5 20C0.5 30.7691 9.23094 39.5 20 39.5C30.7691 39.5 39.5 30.7691 39.5 20C39.5 9.23094 30.7691 0.5 20 0.5ZM25.8716 29L23.75 31.1216L12.6284 20L23.75 8.87844L25.8716 11L16.8716 20L25.8716 29Z" fill="#050505" />
                    </Svg>

                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{t('saved_account_title')}</Text>
            </View>
            <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: '#D9D9D9', marginRight: 16 }} />
                    <Text style={{ fontWeight: '500', fontSize: 16 }}>{bank.bank_name}</Text>
                </View>
                <View style={{ borderTopWidth: 1, borderColor: '#E0E0E0' }} />
                <View style={{ padding: 16 }}>
                    <Text style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>{t('name')}</Text>
                    <Text style={styles.accountName}>{accountData.beneficiaryAccountName}</Text>
                    <Text style={{ color: '#888', fontSize: 13, marginBottom: 4, marginTop: 16 }}>{t('account_number_or_va')}</Text>
                    <Text style={styles.accountNumberInput}>{accountData.beneficiaryAccountNo}</Text>
                    <Text style={{ color: '#888', fontSize: 13, marginBottom: 4, marginTop: 16 }}>{t('note')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 8, justifyContent: 'space-between' }}>
                        <TextInput
                            style={styles.noteInput}
                            value={editableNote}
                            onChangeText={setEditableNote}
                            placeholder={t('note_placeholder')}
                            placeholderTextColor="#BFC6D1"
                        />
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <Path d="M13 3C13.2549 3.00028 13.5 3.09788 13.6854 3.27285C13.8707 3.44782 13.9822 3.68695 13.9972 3.94139C14.0121 4.19584 13.9293 4.44638 13.7657 4.64183C13.6021 4.83729 13.3701 4.9629 13.117 4.993L13 5H5V19H19V11C19.0003 10.7451 19.0979 10.5 19.2728 10.3146C19.4478 10.1293 19.687 10.0178 19.9414 10.0028C20.1958 9.98789 20.4464 10.0707 20.6418 10.2343C20.8373 10.3979 20.9629 10.6299 20.993 10.883L21 11V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H5C4.49542 21.0002 4.00943 20.8096 3.63945 20.4665C3.26947 20.1234 3.04284 19.6532 3.005 19.15L3 19V5C2.99984 4.49542 3.19041 4.00943 3.5335 3.63945C3.87659 3.26947 4.34684 3.04284 4.85 3.005L5 3H13ZM19.243 3.343C19.423 3.16365 19.6644 3.05953 19.9184 3.05177C20.1723 3.04402 20.4197 3.13322 20.6103 3.30125C20.8008 3.46928 20.9203 3.70355 20.9444 3.95647C20.9685 4.2094 20.8954 4.46201 20.74 4.663L20.657 4.758L10.757 14.657C10.577 14.8363 10.3356 14.9405 10.0816 14.9482C9.82767 14.956 9.58029 14.8668 9.38972 14.6988C9.19916 14.5307 9.07969 14.2964 9.0556 14.0435C9.03151 13.7906 9.10459 13.538 9.26 13.337L9.343 13.243L19.243 3.343Z" fill="#666666" />
                        </Svg>
                    </View>

                </View>
            </View>
            <View style={{ position: "relative", alignItems: "center", display: "flex", justifyContent: 'center', flexDirection: "row", gap: 4, alignContent: 'center', paddingHorizontal: 16, paddingTop: 32, paddingBottom: 16, backgroundColor: '#C7EECF', borderBottomStartRadius: 18, borderBottomEndRadius: 18, top: -18, zIndex: -1 }}>
                <Text style={{ color: "#1B5E20", fontSize: 14, textAlign: 'center' }}>{t('success')}</Text>
            </View>
            <TouchableOpacity
                style={[styles.successBox, isAlreadySaved && { backgroundColor: '#BFC6D1' }]}
                onPress={() => setShowPinModal(true)}
                disabled={isAlreadySaved}
            >
                <Text style={styles.successText}>{isAlreadySaved ? t('already_saved') : t('save_number')}</Text>
            </TouchableOpacity>
            {isAlreadySaved && (
                <View style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text style={{ color: '#178AFF', fontWeight: 'bold' }}>{t('already_saved_info')}</Text>
                </View>
            )}
            <VerifyPinModal
                visible={showPinModal}
                callback={handleSaveAccount}
                onClose={() => setShowPinModal(false)}
            />
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', justifyContent: 'center', minWidth: 200 }}>
                        <Text style={{ fontSize: 18, color: '#178AFF', fontWeight: 'bold', marginBottom: 8 }}>{t('success')}</Text>
                        <Text style={{ color: '#222', fontSize: 16 }}>{t('account_saved_success')}</Text>
                    </View>
                </View>
            </Modal>
            {saveError && <Text style={{ color: 'red', marginTop: 12 }}>{saveError}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    accountName: {
        fontSize: 20,
        color: '#444',
        marginTop: 2,
        textTransform: 'capitalize',
        fontWeight: '300',
    },
    accountNumberInput: {
        fontSize: 20,
        color: '#666666',
        borderRadius: 8,
        paddingVertical: 8,
        marginTop: 2,
        fontWeight: '300',
    },
    note: {
        fontSize: 16,
        color: '#888',
        marginTop: 2,
    },
    noteInput: {
        fontSize: 16,
        color: '#888',
        borderRadius: 8,
        paddingVertical: 8,
        marginTop: 2,
        width: '90%',
    },
    successBox: {
        width: '100%',
        backgroundColor: '#178AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
