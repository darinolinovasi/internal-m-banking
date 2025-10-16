import { useError } from '@/contexts/ErrorContext';
import { useTransfer } from '@/hooks/use-transfer';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Example component demonstrating how to use the new error handling system
 * This shows how errors are automatically displayed via the global ErrorProvider
 */
export default function ErrorHandlingExample() {
    const { showError } = useError();
    const { transferToAccount, loading } = useTransfer();
    const [manualErrorVisible, setManualErrorVisible] = useState(false);

    // Example 1: Manual error display
    const showManualError = () => {
        showError('This is a manually triggered error message', {
            title: 'Manual Error',
            showRetry: true,
            onRetry: () => {
                console.log('Retry button was pressed');
            }
        });
    };

    // Example 2: Transfer with automatic error handling
    const performTransfer = async () => {
        try {
            // This will automatically show error modal if transfer fails
            await transferToAccount({
                account: { bank: { bank_code: '002' }, account_number: '1234567890' },
                amount: '100000',
                note: 'Test transfer',
                sourceAccountNo: '2000100101',
                partnerReferenceNo: `TEST${Date.now()}`,
                customerReference: 'TEST123',
                transactionDate: new Date().toISOString(),
            });

            // Success - transfer completed
            showError('Transfer berhasil dilakukan!', {
                title: 'Berhasil',
                showRetry: false,
            });
        } catch (error) {
            // Error is already handled by the hook and shown in modal
            console.log('Transfer failed:', error);
        }
    };

    // Example 3: Network error simulation
    const simulateNetworkError = () => {
        const networkError = {
            response: null, // No response means network error
            message: 'Network request failed'
        };

        // This will be processed by our error handler and show appropriate message
        showError('Simulated network error', {
            title: 'Network Error',
            showRetry: true,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Error Handling Examples</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={showManualError}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Show Manual Error</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={performTransfer}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Processing...' : 'Perform Transfer (Auto Error Handling)'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateNetworkError}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Simulate Network Error</Text>
            </TouchableOpacity>
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
        color: '#333',
    },
    button: {
        backgroundColor: '#178AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
