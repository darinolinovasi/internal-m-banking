import { useError } from '@/contexts/ErrorContext';
import { SecureStorage } from '@/utils/secureStorage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import VerifyPinModal from '../components/VerifyPinModal';
import { useSignIn } from '../hooks/use-signin';

export default function SignInScreen() {
    const { t } = useTranslation();
    const { showError } = useError();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, loading } = useSignIn();
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const router = useRouter();

    const modalCallback = () => {
        router.replace('/home');
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
            showError(t('email_password_required'), { title: t('login_failed') });
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
            // Error handling is now done by the useSignIn hook via ErrorContext
            console.log(err);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
            <VerifyPinModal visible={pinModalVisible} callback={modalCallback} />
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
                            style={[styles.input, { flex: 1, marginBottom: 0 }, !showPassword && {
                                fontFamily: undefined,
                                color: "#000000"
                            }]}
                            placeholder={t('enter_password')}
                            placeholderTextColor="#BFC6D1"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            keyboardType="default"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                            {
                                !showPassword ?
                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                                        <Path d="M16.8108 17.0781C17.2597 16.7403 17.7287 16.2713 18.6667 15.3333C19.1357 14.8643 19.3702 14.6298 19.5391 14.4054C20.6112 12.981 20.6112 11.019 19.5391 9.59458C19.3702 9.37018 19.1357 9.13568 18.6667 8.66668L18.6667 8.66667C17.7287 7.72866 17.2597 7.25965 16.8108 6.92185C13.962 4.77766 10.038 4.77766 7.18916 6.92185C6.74035 7.25965 6.27134 7.72866 5.33333 8.66667C4.86433 9.13567 4.62982 9.37017 4.46092 9.59458C3.38883 11.019 3.38883 12.981 4.46092 14.4054C4.62982 14.6298 4.86433 14.8643 5.33333 15.3333L5.33334 15.3333C6.27135 16.2713 6.74035 16.7404 7.18916 17.0781C10.038 19.2223 13.962 19.2223 16.8108 17.0781Z" stroke="#B2BCC9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <Rect x="9" y="9" width="6" height="6" rx="2.5" stroke="#B2BCC9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>
                                    :
                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                                        <Path d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7 19.5 2.73 16.39 1 12C1.69 10.24 2.79 8.69 4.19 7.46L2 5.27ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15.0005 12.3406 14.943 12.6787 14.83 13L11 9.17C11.3213 9.05698 11.6594 8.99949 12 9ZM12 4.5C17 4.5 21.27 7.61 23 12C22.1834 14.0729 20.7966 15.8723 19 17.19L17.58 15.76C18.9629 14.8034 20.0783 13.5091 20.82 12C20.0117 10.3499 18.7565 8.95963 17.1974 7.98735C15.6382 7.01508 13.8375 6.49976 12 6.5C10.91 6.5 9.84 6.68 8.84 7L7.3 5.47C8.74 4.85 10.33 4.5 12 4.5ZM3.18 12C3.98835 13.6501 5.24345 15.0404 6.80264 16.0126C8.36182 16.9849 10.1625 17.5002 12 17.5C12.69 17.5 13.37 17.43 14 17.29L11.72 15C11.0242 14.9254 10.3748 14.6149 9.87997 14.12C9.38512 13.6252 9.07458 12.9758 9 12.28L5.6 8.87C4.61 9.72 3.78 10.78 3.18 12Z" fill="#B2BCC9" />
                                    </Svg>
                            }
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
