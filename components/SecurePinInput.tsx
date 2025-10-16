/**
 * Secure PIN input component with security features
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSecurity } from './SecurityMiddleware';

interface SecurePinInputProps {
    value: string;
    length?: number;
    onPinChange: (pin: string) => void;
    onPinComplete: (pin: string) => void;
    maxAttempts?: number;
    lockoutDuration?: number;
    showError?: (message: string) => void;
}

export default function SecurePinInput({
    value,
    length = 6,
    onPinChange,
    onPinComplete,
    maxAttempts = 3,
    lockoutDuration = 15 * 60 * 1000, // 15 minutes
    showError
}: SecurePinInputProps) {
    const [pin, setPin] = useState(value);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
    const { incrementPinAttempts, isLocked: globalLocked } = useSecurity();
    const inputRef = useRef<View>(null);

    // Handle PIN input
    const handlePinInput = (digit: string) => {
        if (isLocked || globalLocked) {
            showError?.('Account is locked. Please try again later.');
            return;
        }

        if (pin.length < length) {
            const newPin = pin + digit;
            setPin(newPin);
            onPinChange(newPin);

            if (newPin.length === length) {
                onPinComplete(newPin);
            }
        }
    };

    // Handle PIN deletion
    const handleDelete = () => {
        if (pin.length > 0) {
            const newPin = pin.slice(0, -1);
            setPin(newPin);
            onPinChange(newPin);
        }
    };

    // Handle PIN clear
    const handleClear = () => {
        setPin('');
        onPinChange('');
    };

    // Handle incorrect PIN
    const handleIncorrectPin = () => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        incrementPinAttempts();

        if (newAttempts >= maxAttempts) {
            setIsLocked(true);
            setLockoutEndTime(Date.now() + lockoutDuration);
            showError?.(`Too many incorrect attempts. Account locked for ${Math.ceil(lockoutDuration / 60000)} minutes.`);
        } else {
            const remainingAttempts = maxAttempts - newAttempts;
            showError?.(`Incorrect PIN. ${remainingAttempts} attempts remaining.`);
        }

        // Clear PIN after incorrect attempt
        setTimeout(() => {
            handleClear();
        }, 1000);
    };

    // Check lockout status
    useEffect(() => {
        if (lockoutEndTime && Date.now() >= lockoutEndTime) {
            setIsLocked(false);
            setLockoutEndTime(null);
            setAttempts(0);
        }
    }, [lockoutEndTime]);

    // Reset attempts on successful PIN
    const resetAttempts = () => {
        setAttempts(0);
    };

    // Expose methods for parent component
    React.useImperativeHandle(inputRef, () => ({
        handleIncorrectPin,
        resetAttempts,
        clearPin: handleClear
    }));

    const renderPinDots = () => {
        return Array.from({ length }).map((_, index) => {
            const isActive = index === pin.length;
            const isFilled = pin[index];

            return (
                <View
                    key={index}
                    style={[
                        styles.pinDot,
                        isActive && pin.length < length && styles.activeDot,
                        isFilled && styles.filledDot
                    ]}
                >
                    {isFilled && <Text style={styles.pinDotText}>●</Text>}
                </View>
            );
        });
    };

    const renderKeypad = () => {
        const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

        return (
            <View style={styles.keypad}>
                {digits.map((digit, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.keypadButton,
                            digit === '' && styles.emptyButton
                        ]}
                        onPress={() => {
                            if (digit === '⌫') {
                                handleDelete();
                            } else if (digit !== '') {
                                handlePinInput(digit);
                            }
                        }}
                        disabled={isLocked || globalLocked || digit === ''}
                    >
                        <Text style={[
                            styles.keypadButtonText,
                            (isLocked || globalLocked) && styles.disabledText
                        ]}>
                            {digit}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.pinContainer}>
                {renderPinDots()}
            </View>

            {isLocked && (
                <Text style={styles.lockoutText}>
                    Account locked. Try again in {Math.ceil((lockoutEndTime! - Date.now()) / 60000)} minutes.
                </Text>
            )}

            {renderKeypad()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#BFC6D1',
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    activeDot: {
        borderColor: '#178AFF',
        backgroundColor: '#178AFF',
    },
    filledDot: {
        borderColor: '#178AFF',
        backgroundColor: '#178AFF',
    },
    pinDotText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 240,
    },
    keypadButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    emptyButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    keypadButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    disabledText: {
        color: '#CCC',
    },
    lockoutText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
});
