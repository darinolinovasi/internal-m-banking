import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useVirtualAccountTransfer } from '../hooks/use-virtual-account-transfer';
import VerifyPinModal from './VerifyPinModal';

interface VirtualAccountData {
    additionalInfo: {
        description: string;
    };
    customerNo: string;
    partnerServiceId: string;
    totalAmount: {
        currency: string;
        value: string;
    };
    virtualAccountName: string;
    virtualAccountNo: string;
}

interface VirtualAccountSuccessModalProps {
    visible: boolean;
    virtualAccountData: VirtualAccountData;
    onClose: () => void;
    onContinue: () => void;
    transferAmount?: string;
    transferNote?: string;
    setShowSuccessModal: (value: boolean) => void;
}

export default function VirtualAccountSuccessModal({
    visible,
    virtualAccountData,
    onClose,
    onContinue,
    transferAmount = virtualAccountData?.totalAmount?.value || '0',
    transferNote = '',
    setShowSuccessModal
}: VirtualAccountSuccessModalProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [showPinModal, setShowPinModal] = useState(false);
    const [isPinVerifying, setIsPinVerifying] = useState(false);
    const { transferToVirtualAccount, loading: transferLoading, error: transferError } = useVirtualAccountTransfer();

    const formatAmount = (value: string, currency: string) => {
        const numValue = parseFloat(value);
        return `${currency} ${numValue.toLocaleString('id-ID')}`;
    };

    const handleTransferPress = () => {
        setIsPinVerifying(true);
        setShowPinModal(true);
        setShowSuccessModal(false);
    };

    const handlePinVerified = async () => {
        setShowPinModal(false);
        setIsPinVerifying(false);
        try {
            // Generate reference numbers
            const partnerReferenceNo = `VA${Date.now()}`;
            const customerReference = `CUST${Date.now()}`;

            // Get user's source account (you might need to get this from context or props)
            const sourceAccountNo = '1234567890'; // This should come from user context

            const transferParams = {
                virtualAccountData,
                amount: transferAmount,
                note: transferNote,
                sourceAccountNo,
                partnerReferenceNo,
                customerReference,
                transactionDate: new Date().toISOString(),
                internalData: {
                    recipientAccountID: null, // Virtual account doesn't have a specific account ID
                    recipientAccountType: "virtual_account",
                    recipientName: virtualAccountData?.virtualAccountName || '',
                    bankID: 313,
                    TransferType: "manual",
                    TransactionType: "transfer_out"
                },
            };

            const response = await transferToVirtualAccount(transferParams);

            console.log("TRANSFER RESPONSE", response.data);

            if (response.status === 200) {
                console.log(response.data)
                // Transfer successful, navigate to receipt screen with transfer response data
                router.push({
                    pathname: '/receipt',
                    params: {
                        referenceNo: response.data.data.virtualAccountData.referenceNo == "" ? response.data.data.virtualAccountData.partnerReferenceNo : response.data.data.virtualAccountData.referenceNo,
                    }
                });
            }
        } catch (error) {
            console.error('Transfer failed:', error);
            setIsPinVerifying(false);
            // Error is handled by the hook and can be displayed to user
        }
    };

    const handlePinModalClose = () => {
        setShowPinModal(false);
        setIsPinVerifying(false);
        // User cancelled PIN verification, inquiry modal will remain visible
    };

    // Don't render if virtualAccountData is not available
    if (!virtualAccountData) {
        return null;
    }

    return (
        <>
            <Modal
                visible={visible && !isPinVerifying}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <Path
                                        d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm5.707 10.707l-7 7a.997.997 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L14 17.586l6.293-6.293a1 1 0 011.414 1.414z"
                                        fill="#4CAF50"
                                    />
                                </Svg>
                            </View>
                            <Text style={styles.title}>{t('virtual_account_found', 'Virtual Account Found')}</Text>
                            <Text style={styles.subtitle}>
                                {t('virtual_account_validated', 'Virtual account has been validated successfully')}
                            </Text>
                        </View>

                        {/* Virtual Account Information */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('virtual_account_name', 'Virtual Account Name')}</Text>
                                <Text style={styles.infoValue}>{virtualAccountData?.virtualAccountName || '-'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('virtual_account_number', 'Virtual Account Number')}</Text>
                                <Text style={styles.infoValue}>{virtualAccountData?.virtualAccountNo?.trim() || '-'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('total_amount', 'Total Amount')}</Text>
                                <Text style={styles.infoValue}>
                                    {virtualAccountData?.totalAmount ?
                                        formatAmount(virtualAccountData.totalAmount.value, virtualAccountData.totalAmount.currency) :
                                        '-'
                                    }
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('partner_service_id', 'Partner Service ID')}</Text>
                                <Text style={styles.infoValue}>{virtualAccountData?.partnerServiceId?.trim() || '-'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('customer_number', 'Customer Number')}</Text>
                                <Text style={styles.infoValue}>{virtualAccountData?.customerNo || '-'}</Text>
                            </View>

                            {virtualAccountData?.additionalInfo?.description && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>{t('description', 'Description')}</Text>
                                    <Text style={styles.infoValue}>{virtualAccountData.additionalInfo.description}</Text>
                                </View>
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>{t('cancel', 'Cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.continueButton, transferLoading && styles.continueButtonDisabled]}
                                onPress={handleTransferPress}
                                disabled={transferLoading}
                            >
                                <Text style={styles.continueButtonText}>
                                    {transferLoading ? t('processing', 'Processing...') : t('transfer', 'Transfer')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* PIN Verification Modal */}
            <VerifyPinModal
                visible={showPinModal}
                callback={handlePinVerified}
                onClose={handlePinModalClose}
            />
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F5E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    infoContainer: {
        padding: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 16,
    },
    infoValue: {
        fontSize: 14,
        color: '#222',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FAFAFA',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    continueButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#178AFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#178AFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    continueButtonDisabled: {
        backgroundColor: '#A0CFFF',
        shadowOpacity: 0.1,
    },
});
