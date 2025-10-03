import BottomSheet from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ChangePasswordSheetProps {
    visible: boolean;
    onClose: () => void;
    onSubmit?: (oldPass: string, newPass: string, confirmPass: string) => void;
}

const snapPoints = ['100%', '50%'];

const ChangePasswordSheet: React.FC<ChangePasswordSheetProps> = ({ visible, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    // Clear all input when sheet is closed
    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    const isButtonDisabled = !oldPassword || !newPassword || !confirmPassword;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={visible ? 0 : -1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={handleClose}
            enableDynamicSizing={false}
            backgroundStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            handleIndicatorStyle={{ backgroundColor: '#D9D9D9' }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.sheet}>
                    <Text style={styles.title}>{t('update_password_title')}</Text>
                    <View style={styles.divider} />
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('old_password')}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            placeholder=""
                            placeholderTextColor="#888"
                        />
                        <Text style={styles.label}>{t('new_password')}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder=""
                            placeholderTextColor="#888"
                        />
                        <Text style={styles.label}>{t('confirm_password')}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder=""
                            placeholderTextColor="#888"
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                        disabled={isButtonDisabled}
                        onPress={() => onSubmit?.(oldPassword, newPassword, confirmPassword)}
                    >
                        <Text style={styles.buttonText}>{t('update')}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    sheet: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 16,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 13,
        color: '#222',
        marginBottom: 4,
        marginTop: 12,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#222',
        fontSize: 15,
        paddingVertical: 6,
        marginBottom: 0,
        color: '#222',
    },
    button: {
        backgroundColor: '#D3D3D3',
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChangePasswordSheet;
