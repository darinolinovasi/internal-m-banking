/**
 * Invalid PIN Modal Component
 * Shows user-friendly error messages for invalid PIN attempts
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface InvalidPinModalProps {
    visible: boolean;
    onClose: () => void;
    onRetry?: () => void;
    onForgotPin?: () => void;
}

export default function InvalidPinModal({
    visible,
    onClose,
    onRetry,
    onForgotPin,
}: InvalidPinModalProps) {
    const { t } = useTranslation();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const [shakeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            // Animate modal appearance
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            // Shake animation for emphasis
            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: -10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 10,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Reset animations when modal is hidden
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.8);
            shakeAnim.setValue(0);
        }
    }, [visible]);

    const handleRetry = () => {
        onRetry?.();
        onClose();
    };

    const handleForgotPin = () => {
        Alert.alert(
            t('forgot_pin_title'),
            t('forgot_pin_message'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('contact_support'),
                    onPress: () => {
                        onForgotPin?.();
                        onClose();
                    },
                },
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    { opacity: fadeAnim }
                ]}
            >
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [
                                { scale: scaleAnim },
                                { translateX: shakeAnim }
                            ]
                        }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[
                            styles.iconContainer
                        ]}>
                            <Text style={styles.iconText}>⚠️</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>

                        <TouchableOpacity
                            style={[styles.button, styles.retryButton]}
                            onPress={handleRetry}
                        >
                            <Text style={styles.retryButtonText}>
                                {t('try_again')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.forgotButton]}
                            onPress={handleForgotPin}
                        >
                            <Text style={styles.forgotButtonText}>
                                {t('forgot_pin')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.closeButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>
                                {t('close')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: width * 0.9,
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconText: {
        fontSize: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    content: {
        marginBottom: 24,
    },
    message: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    attemptsContainer: {
        alignItems: 'center',
    },
    attemptsText: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 12,
    },
    attemptsBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    attemptDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    lockoutContainer: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    lockoutText: {
        fontSize: 14,
        color: '#E65100',
        textAlign: 'center',
        fontWeight: '500',
    },
    actions: {
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButton: {
        backgroundColor: '#2196F3',
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    forgotButtonText: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    closeButtonText: {
        color: '#999999',
        fontSize: 16,
        fontWeight: '500',
    },
});
