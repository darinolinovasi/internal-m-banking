import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import SessionExpiredModal from '../components/SessionExpiredModal';
import VirtualAccountSuccessModal from '../components/VirtualAccountSuccessModal';
import { useVirtualAccountInquiry } from '../hooks/use-virtual-account-inquiry';

export default function VirtualAccountScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [virtualAccountNumber, setVirtualAccountNumber] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [virtualAccountData, setVirtualAccountData] = useState<any>(null);
    const { inquiryVirtualAccount, loading, error: inquiryError, sessionExpired, clearError, clearSessionExpired } = useVirtualAccountInquiry();

    const handleInputChange = (val: string) => {
        // Only allow numbers, max 16 digits
        const sanitized = val.replace(/[^0-9]/g, '').slice(0, 16);
        setVirtualAccountNumber(sanitized);
        setError(null);
        clearError();
    };

    const handleInquiry = async () => {
        if (!virtualAccountNumber || virtualAccountNumber.length < 3) {
            setError(t('virtual_account_min_length', 'Virtual account number must be at least 3 digits'));
            return;
        }

        try {
            const response = await inquiryVirtualAccount(virtualAccountNumber);

            if (response && response.status === 200) {
                // Show success modal with virtual account data
                setVirtualAccountData(response.data.data.virtualAccountData);
                setShowSuccessModal(true);
            } else {
                setError(t('virtual_account_not_found', 'Virtual account number not found'));
            }
        } catch (err: any) {
            // Error handled by hook
            console.log(err.response?.data)
            setError(inquiryError || t('virtual_account_error', 'Error validating virtual account'));
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        setVirtualAccountData(null);
    };

    const handleContinueTransfer = () => {
        setShowSuccessModal(false);
        // Navigate to transfer screen with virtual account data
        router.push(`/saved-accounts?type=virtual&account=${virtualAccountNumber}&data=${encodeURIComponent(JSON.stringify(virtualAccountData))}`);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
                <View style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                                <Path d="M20 0.5C9.23094 0.5 0.5 9.23094 0.5 20C0.5 30.7691 9.23094 39.5 20 39.5C30.7691 39.5 39.5 30.7691 39.5 20C39.5 9.23094 30.7691 0.5 20 0.5ZM25.8716 29L23.75 31.1216L12.6284 20L23.75 8.87844L25.8716 11L16.8716 20L25.8716 29Z" fill="#050505" />
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('transfer_to_new_virtual_account')}</Text>
                    </View>

                    {/* Main Content */}
                    <View style={styles.container}>
                        <View style={styles.inputSection}>
                            <Text style={styles.sectionTitle}>{t('enter_virtual_account_number', 'Enter Virtual Account Number')}</Text>
                            <Text style={styles.sectionSubtitle}>{t('virtual_account_description', 'Enter the virtual account number you want to transfer to')}</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.virtualAccountInput}
                                    value={virtualAccountNumber}
                                    onChangeText={handleInputChange}
                                    placeholder={t('virtual_account_placeholder', 'Enter virtual account number')}
                                    placeholderTextColor="#BFC6D1"
                                    maxLength={16}
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoFocus={true}
                                />
                            </View>

                            {/* Error Message */}
                            {(error || inquiryError) && (
                                <View style={styles.errorContainer}>
                                    <Svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                        <Path d="M0.75 15.75H17.25L9 1.5L0.75 15.75ZM9.75 13.5H8.25V12H9.75V13.5ZM9.75 10.5H8.25V7.5H9.75V10.5Z" fill="#C81C4D" />
                                    </Svg>
                                    <Text style={styles.errorText}>{error || inquiryError}</Text>
                                </View>
                            )}
                        </View>

                        {/* Continue Button */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.continueButton, virtualAccountNumber.length >= 3 && !loading && styles.continueButtonActive]}
                                onPress={handleInquiry}
                                disabled={virtualAccountNumber.length < 3 || loading}
                            >
                                <Text style={[styles.continueButtonText, virtualAccountNumber.length >= 3 && !loading && styles.continueButtonTextActive]}>
                                    {loading ? t('validating', 'Validating...') : t('continue', 'Continue')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Virtual Account Success Modal */}
                {virtualAccountData && (
                    <VirtualAccountSuccessModal
                        visible={showSuccessModal}
                        virtualAccountData={virtualAccountData}
                        onClose={handleModalClose}
                        onContinue={handleContinueTransfer}
                        setShowSuccessModal={setShowSuccessModal}
                    />
                )}

                {/* Session Expired Modal */}
                <SessionExpiredModal
                    visible={sessionExpired}
                    onClose={clearSessionExpired}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F7F7F7',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    backBtn: {
        marginRight: 8,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    inputSection: {
        flex: 1,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 32,
        lineHeight: 20,
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
    },
    virtualAccountInput: {
        fontSize: 18,
        fontWeight: '500',
        color: '#222',
        padding: 0,
        margin: 0,
        minHeight: 24,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE8EF',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECDD3',
    },
    errorText: {
        color: '#C81C4D',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    buttonContainer: {
        paddingBottom: 16,
    },
    continueButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonActive: {
        backgroundColor: '#178AFF',
    },
    continueButtonText: {
        color: '#999',
        fontSize: 16,
        fontWeight: 'bold',
    },
    continueButtonTextActive: {
        color: '#fff',
    },
});
