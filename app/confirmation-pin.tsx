import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoModal from '../components/InfoModal';
import PinInput from '../components/PinInput';
import PinKeypad from '../components/PinKeypad';
import { useUpdatePin } from '../hooks/use-update-pin';

export default function ConfirmationPinScreen() {
    // Optionally, get the original PIN from route params if needed
    const [pin, setPin] = useState('');
    const { originalPin } = useLocalSearchParams();
    const { updatePin, loading, error } = useUpdatePin();
    const router = useRouter();
    const [modal, setModal] = useState<{ visible: boolean; message: string; loading?: boolean }>({ visible: false, message: '', loading: false });

    const handleKeypad = (val: string) => {
        if (pin.length < 6) setPin(pin + val);
    };
    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    useEffect(() => {
        const doUpdatePin = async () => {
            try {
                setModal({ visible: true, message: 'Memperbarui PIN...', loading: true });
                const response = await updatePin(originalPin as string, pin);
                if (response.status === 200) {
                    setModal({ visible: true, message: 'PIN Anda berhasil dibuat!', loading: false });
                    setTimeout(() => {
                        setModal({ visible: false, message: '', loading: false });
                        router.replace('/(tabs)');
                    }, 1500);
                }
            } catch (err) {
                setModal({ visible: true, message: error || 'Terjadi kesalahan saat membuat PIN.', loading: false });
                setTimeout(() => {
                    setModal({ visible: false, message: '', loading: false });
                    setPin('');
                    router.replace('/create-pin');
                }, 1500);
            }
        };
        if (pin.length === 6) {
            if (originalPin && pin != originalPin) {
                setModal({ visible: true, message: 'PIN tidak cocok, silakan coba lagi.', loading: false });
                setTimeout(() => {
                    setModal({ visible: false, message: '', loading: false });
                    setPin('');
                    router.replace('/create-pin');
                }, 1500);
            } else {
                doUpdatePin();
            }
        }
    }, [pin]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
            <View style={styles.container}>
                <View></View>
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={styles.title}>Konfirmasi PIN</Text>
                    <PinInput value={pin} />
                </View>
                <PinKeypad onPress={handleKeypad} onDelete={handleDelete} />
                <InfoModal visible={modal.visible} message={modal.message} loading={modal.loading} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#373B47',
        marginBottom: 8,
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
