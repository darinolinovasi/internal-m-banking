import api from '@/api/api';
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Test401Redirect() {
    const { showError } = useError();
    const router = useRouter();
    const handleError = createErrorHandler(showError, router);

    const test401Error = () => {
        // Simulate a 401 error response
        const mockError = {
            response: {
                status: 401,
                data: {
                    error: {
                        responseCode: '401',
                        responseMessage: 'Unauthorized Client'
                    }
                }
            }
        };

        console.log('🧪 Testing 401 error handling (should show modal first, then redirect)...');
        handleError(mockError);
    };

    const test401InvalidPin = () => {
        // Simulate a 401 error with invalid PIN
        const mockError = {
            response: {
                status: 401,
                data: {
                    error: {
                        responseCode: '401',
                        responseMessage: 'Invalid PIN'
                    }
                }
            }
        };

        console.log('🧪 Testing 401 invalid PIN error handling...');
        handleError(mockError);
    };

    const testRealApiCall = async () => {
        try {
            // This will likely fail with 401 if your session is expired
            console.log('🧪 Testing real API call...');
            await api.get('/account/balance');
        } catch (error) {
            console.log('🧪 Real API call failed:', error);
            handleError(error);
        }
    };

    const testNewErrorMessages = () => {
        // Test some of the new error messages
        const testErrors = [
            { message: 'Insufficient Funds', expected: 'Saldo tidak mencukupi' },
            { message: 'Invalid Amount', expected: 'Jumlah tidak valid' },
            { message: 'Dormant Account', expected: 'Rekening dalam status tidak aktif' },
            { message: 'Paid Bill', expected: 'Tagihan sudah dibayar' }
        ];

        testErrors.forEach((testError, index) => {
            setTimeout(() => {
                const mockError = {
                    response: {
                        status: 400,
                        data: {
                            error: {
                                responseMessage: testError.message
                            }
                        }
                    }
                };
                console.log(`🧪 Testing error message ${index + 1}: ${testError.message}`);
                handleError(mockError);
            }, index * 2000); // Space them out by 2 seconds
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>401 Redirect Test</Text>

            <TouchableOpacity style={styles.button} onPress={test401Error}>
                <Text style={styles.buttonText}>Test 401 (Should Redirect)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={test401InvalidPin}>
                <Text style={styles.buttonText}>Test 401 Invalid PIN (Should NOT Redirect)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={testRealApiCall}>
                <Text style={styles.buttonText}>Test Real API Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={testNewErrorMessages}>
                <Text style={styles.buttonText}>Test New Error Messages</Text>
            </TouchableOpacity>

            <Text style={styles.instruction}>
                Check the console logs to see what's happening with the error handling.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    instruction: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});
