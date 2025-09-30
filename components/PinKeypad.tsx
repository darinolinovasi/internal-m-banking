import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PinKeypadProps {
    onPress: (val: string) => void;
    onDelete: () => void;
}

const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
];

export default function PinKeypad({ onPress, onDelete }: PinKeypadProps) {
    return (
        <View style={styles.container}>
            {keys.map((row, i) => (
                <View style={styles.row} key={i}>
                    {row.map((key) => (
                        key === 'del' ? (
                            <TouchableOpacity key={key} style={styles.key} onPress={onDelete}>
                                <Text style={styles.keyText}>⌫</Text>
                            </TouchableOpacity>
                        ) : key ? (
                            <TouchableOpacity key={key} style={styles.key} onPress={() => onPress(key)}>
                                <Text style={styles.keyText}>{key}</Text>
                            </TouchableOpacity>
                        ) : (
                            <View key={key} style={styles.key} />
                        )
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        backgroundColor: '#E0E0E0',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginBottom: 12,
        width: '100%',
        // gap: 12,
    },
    key: {
        width: '33%',
        height: 100,
        // borderRadius: 32,
        backgroundColor: '#fff',
        // marginHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 1,
    },
    keyText: {
        fontSize: 26,
        color: '#222',
        fontWeight: 'bold',
    },
});
