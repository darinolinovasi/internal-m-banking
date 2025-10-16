import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import VerifyPinModal from '../components/VerifyPinModal';
import { useSignIn } from '../hooks/use-signin';

export default function SignInScreen() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, loading, error } = useSignIn();
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const modalCallback = () => {
        router.replace('/');
        setPinModalVisible(false);
    }

    React.useEffect(() => {
        const checkJwt = async () => {
            const jwt = await SecureStorage.getJWT();
            if (jwt) {
                setPinModalVisible(true);
            }
        };
        checkJwt();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage(t('email_password_required'));
            setShowErrorModal(true);
            return;
        }
        try {
            const result = await signIn(email, password);
            if (result.data.user.pin_created) {
                setPinModalVisible(true);
            } else {
                router.replace('/create-pin');
            }
        } catch (err) {
            setErrorMessage(error as string);
            setShowErrorModal(true);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
            <VerifyPinModal visible={pinModalVisible} callback={modalCallback} />
            <Modal visible={showErrorModal && !!errorMessage} transparent animationType="fade" onRequestClose={() => setShowErrorModal(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', justifyContent: 'center', minWidth: 200 }}>
                        <Text style={{ fontSize: 18, color: '#C81C4D', fontWeight: 'bold', marginBottom: 8 }}>{t('login_failed')}</Text>
                        <Text style={{ color: '#222', fontSize: 16 }}>{errorMessage}</Text>
                        <TouchableOpacity style={{ marginTop: 24 }} onPress={() => setShowErrorModal(false)}>
                            <Text style={{ color: '#178AFF', fontWeight: 'bold', fontSize: 16 }}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.container}>
                <Text style={styles.title}>{t('signin')}</Text>
                <View style={{ marginTop: 40, width: '100%' }}>
                    <Text style={styles.label}>{t('email_address')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('enter_email')}
                        placeholderTextColor="#BFC6D1"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={{ marginTop: 32 }}>
                    <Text style={styles.label}>{t('password')}</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder={t('enter_password')}
                            placeholderTextColor="#BFC6D1"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                                <Path d="M16.8108 17.0781C17.2597 16.7403 17.7287 16.2713 18.6667 15.3333C19.1357 14.8643 19.3702 14.6298 19.5391 14.4054C20.6112 12.981 20.6112 11.019 19.5391 9.59458C19.3702 9.37018 19.1357 9.13568 18.6667 8.66668L18.6667 8.66667C17.7287 7.72866 17.2597 7.25965 16.8108 6.92185C13.962 4.77766 10.038 4.77766 7.18916 6.92185C6.74035 7.25965 6.27134 7.72866 5.33333 8.66667C4.86433 9.13567 4.62982 9.37017 4.46092 9.59458C3.38883 11.019 3.38883 12.981 4.46092 14.4054C4.62982 14.6298 4.86433 14.8643 5.33333 15.3333L5.33334 15.3333C6.27135 16.2713 6.74035 16.7404 7.18916 17.0781C10.038 19.2223 13.962 19.2223 16.8108 17.0781Z" stroke="#B2BCC9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <Rect x="9" y="9" width="6" height="6" rx="2.5" stroke="#B2BCC9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>

                            {/* <Text style={{ color: '#BFC6D1', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.signInButtonText}>{loading ? t('loading') : t('signin')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 24 }}>
                    <Text style={styles.forgotText}>{t('forgot_password')} <Text style={styles.resetText}>{t('reset')}</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 48,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#373B47',
        marginBottom: 12,
        marginTop: 8,
    },
    label: {
        fontSize: 16,
        color: '#373B47',
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        width: '100%',
        height: 56,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 4,
        borderWidth: 0,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        height: 56,
        width: '100%',
    },
    eyeButton: {
        paddingHorizontal: 16,
        height: '100%',
        justifyContent: 'center',
    },
    signInButton: {
        marginTop: 36,
        padding: 16,
        width: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    forgotText: {
        color: '#BFC6D1',
        fontSize: 14,
        textAlign: 'center',
    },
    resetText: {
        color: '#373B47',
        fontWeight: '600',
    },
});
