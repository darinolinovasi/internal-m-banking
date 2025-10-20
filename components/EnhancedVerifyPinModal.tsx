/**
 * Enhanced PIN Verification Modal
 * Uses the new InvalidPinModal for better user experience
 */

import { useEnhancedPinVerification } from '@/hooks/useEnhancedPinVerification';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    View
} from 'react-native';
import InvalidPinModal from './InvalidPinModal';
import PinInput from './PinInput';
import PinKeypad from './PinKeypad';

interface EnhancedVerifyPinModalProps {
    visible: boolean;
    onSuccess?: () => void;
    onClose?: () => void;
    title?: string;
    subtitle?: string;
}

export default function EnhancedVerifyPinModal({
    visible,
    onSuccess,
    onClose,
    title,
    subtitle
}: EnhancedVerifyPinModalProps) {
    const { t } = useTranslation();
    const [pin, setPin] = useState('');

    const {
        isVerifying,
        showInvalidPinModal,
        verifyPin,
        handleForgotPin,
        closeInvalidPinModal,
    } = useEnhancedPinVerification();

    // Auto-verify when PIN is complete
    useEffect(() => {
        const autoVerify = async () => {
            if (pin.length === 6 && !isVerifying) {
                const success = await verifyPin(pin);
                if (success) {
                    setPin('');
                    onSuccess?.();
                } else {
                    setPin('');
                }
            }
        };

        autoVerify();
    }, [pin, isVerifying, verifyPin, onSuccess]);

    // Handle keypad input
    const handleKeypad = (value: string) => {
        if (pin.length < 6 && !isVerifying) {
            setPin(prev => prev + value);
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (!isVerifying) {
            setPin(prev => prev.slice(0, -1));
        }
    };

    // Handle modal close
    const handleClose = () => {
        if (!isVerifying) {
            setPin('');
            onClose?.();
        }
    };

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={false}
                style={styles.modal}
                onRequestClose={handleClose}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {title || t('verify_pin_title')}
                        </Text>
                        <Text style={styles.subtitle}>
                            {subtitle || t('verify_pin_subtitle')}
                        </Text>
                    </View>

                    {/* PIN Input */}
                    <View style={styles.pinContainer}>
                        <PinInput value={pin} />
                    </View>

                    {/* Keypad */}
                    <View style={styles.keypadContainer}>
                        <PinKeypad
                            onPress={handleKeypad}
                            onDelete={handleDelete}
                        />
                    </View>

                    {/* Loading Overlay */}
                    {isVerifying && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#178AFF" />
                                <Text style={styles.loadingText}>
                                    {t('verifying_pin')}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>

            {/* Invalid PIN Modal */}
            <InvalidPinModal
                visible={showInvalidPinModal}
                onClose={closeInvalidPinModal}
                onForgotPin={handleForgotPin}
            />
        </>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: '#001F3F',
    },
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#373B47',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    pinContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    attemptsWarning: {
        fontSize: 14,
        color: '#FF5722',
        marginTop: 12,
        fontWeight: '500',
    },
    keypadContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        minWidth: 200,
    },
    loadingText: {
        marginTop: 16,
        color: '#222',
        fontSize: 16,
        fontWeight: '500',
    },
    lockoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    lockoutIcon: {
        fontSize: 80,
        marginBottom: 24,
    },
    lockoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5722',
        marginBottom: 16,
        textAlign: 'center',
    },
    lockoutMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    lockoutButton: {
        backgroundColor: '#178AFF',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    lockoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
