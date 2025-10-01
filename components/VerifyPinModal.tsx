import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, View } from 'react-native';
import PinInput from '../components/PinInput';
import PinKeypad from '../components/PinKeypad';
import { useVerifyPin } from '../hooks/use-verify-pin';

interface VerifyPinModalProps {
    visible: boolean;
    callback?: () => void;
}

export default function VerifyPinModal({
    visible,
    callback
}: VerifyPinModalProps) {
    const [pin, setPin] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);

    const router = useRouter();
    const { verifyPin, loading, error } = useVerifyPin();

    const handleKeypad = (val: string) => {
        if (pin.length < 6) setPin(pin + val);
    };
    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    useEffect(() => {
        const doVerify = async () => {
            try {
                const response = await verifyPin(pin);
                if (response.status === 200) {
                    setPin('');
                    callback && callback();
                }
            } catch (err: any) {
                if (err?.response?.status === 401) {
                    setPin('');
                    setSessionExpired(true);
                    setTimeout(async () => {
                        await AsyncStorage.removeItem('jwt');
                        setSessionExpired(false);
                        router.replace('/signin');
                    }, 1500);
                    return;
                }
                Alert.alert('PIN Salah', error || 'PIN yang Anda masukkan salah.');
                setPin('');
            }
        };
        if (pin.length === 6) {
            doVerify();
        }
    }, [pin]);

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={false}
                style={{ flex: 1, backgroundColor: '#001F3F' }}
            >
                <View style={styles.container}>
                    <View></View>
                    <View style={{ alignItems: 'center', width: '100%' }}>

                        <Text style={styles.title}>Verifikasi PIN</Text>
                        <Text style={styles.subtitle}>Masukkan 6 digit PIN Anda untuk melanjutkan</Text>
                        <PinInput value={pin} />
                    </View>
                    <PinKeypad onPress={handleKeypad} onDelete={handleDelete} />
                    <Modal
                        visible={loading}
                        transparent
                        animationType="fade"
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <ActivityIndicator size="large" color="#178AFF" />
                                <Text style={{ marginTop: 16, color: '#222', fontSize: 16 }}>Memverifikasi PIN...</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Modal>
            <Modal
                visible={sessionExpired}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, color: '#C81C4D', fontWeight: 'bold', marginBottom: 8 }}>Sesi Berakhir</Text>
                        <Text style={{ color: '#222', fontSize: 16, textAlign: 'center' }}>Sesi Anda telah berakhir. Silakan login kembali.</Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 24,
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#373B47',
        marginBottom: 8,
    },
    subtitle: {
        color: '#888',
        fontSize: 15,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 32,
        width: 240,
        height: 48,
        backgroundColor: '#007AFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
});
