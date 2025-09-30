import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

interface InfoModalProps {
    visible: boolean;
    message: string;
    loading?: boolean;
}

export default function InfoModal({ visible, message, loading }: InfoModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {loading && <ActivityIndicator size="large" color="#178AFF" />}
                    <Text style={styles.text}>{message}</Text>
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
});
