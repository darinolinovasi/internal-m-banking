import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InfoModalWithButtonProps {
    visible: boolean;
    message: string;
    loading?: boolean;
    buttonText?: string;
    onButtonPress?: () => void;
}

export default function InfoModalWithButton({ visible, message, loading, buttonText = 'OK', onButtonPress }: InfoModalWithButtonProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {loading && <ActivityIndicator size="large" color="#178AFF" />}
                    <Text style={styles.text}>{message}</Text>
                    {onButtonPress && (
                        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
    text: {
        marginTop: 16,
        color: '#222',
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 24,
        backgroundColor: '#178AFF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
