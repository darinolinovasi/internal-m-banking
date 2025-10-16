import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ErrorModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
    showRetry?: boolean;
    onRetry?: () => void;
}

export default function ErrorModal({
    visible,
    title,
    message,
    onClose,
    buttonText = 'OK',
    showRetry = false,
    onRetry
}: ErrorModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>⚠️</Text>
                    </View>

                    <Text style={styles.title}>
                        {title || t('error_title', 'Error')}
                    </Text>

                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.buttonContainer}>
                        {showRetry && onRetry && (
                            <TouchableOpacity
                                style={[styles.button, styles.retryButton]}
                                onPress={onRetry}
                            >
                                <Text style={styles.retryButtonText}>
                                    {t('retry', 'Retry')}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.primaryButtonText}>
                                {buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 280,
        maxWidth: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 16,
    },
    icon: {
        fontSize: 48,
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#C81C4D',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#178AFF',
    },
    retryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#178AFF',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    retryButtonText: {
        color: '#178AFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
