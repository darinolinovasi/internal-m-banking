import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PinInput from '../components/PinInput';
import PinKeypad from '../components/PinKeypad';

export default function CreatePinScreen() {
    const [pin, setPin] = useState('');
    const router = useRouter();
    const { t } = useTranslation();

    const handleKeypad = (val: string) => {
        if (pin.length < 6) setPin(pin + val);
    };
    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    useEffect(() => {
        if (pin.length === 6) {
            router.navigate({ pathname: '/confirmation-pin', params: { originalPin: pin } });
        }
    }, [pin]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
            <View style={styles.container}>
                <View></View>
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={styles.title}>{t('create_pin_title')}</Text>
                    <PinInput value={pin} />
                </View>
                <PinKeypad onPress={handleKeypad} onDelete={handleDelete} />
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
});
