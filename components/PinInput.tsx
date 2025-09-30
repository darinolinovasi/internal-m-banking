import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PinInputProps {
    value: string;
    length?: number;
}

export default function PinInput({ value, length = 6 }: PinInputProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length }).map((_, i) => {
                const isActive = i === value.length;
                const isFilled = value[i];
                return (
                    <View
                        key={i}
                        style={[styles.input, isActive && value.length < length ? styles.activeInput : null]}
                    >
                        <Text style={styles.inputText}>{isFilled ? '＊' : ''}</Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 24,
    },
    input: {
        width: 40,
        height: 48,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#BFC6D1',
        marginHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    activeInput: {
        backgroundColor: '#178AFF',
        borderColor: '#178AFF',
    },
    inputText: {
        fontSize: 28,
        color: '#222',
        fontWeight: 'bold',
    },
});
