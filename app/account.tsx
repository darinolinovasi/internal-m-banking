import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import ChangePasswordSheet from '../components/ChangePasswordSheet';
import VerifyPinModal from '../components/VerifyPinModal';

export default function AccountScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [showPinModal, setShowPinModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const handleVerifySuccess = () => {
        setShowPinModal(false);
        router.push('/create-pin');
    };

    const [user, setUser] = useState<any>(null);

    React.useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await AsyncStorage.getItem('user');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                setUser(user);
            }
        };

        getUserInfo();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
                {/* Header */}
                <View style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Svg width="24" height="24" viewBox="0 0 40 40" fill="none" >
                                <Path d="M20 0.5C9.23094 0.5 0.5 9.23094 0.5 20C0.5 30.7691 9.23094 39.5 20 39.5C30.7691 39.5 39.5 30.7691 39.5 20C39.5 9.23094 30.7691 0.5 20 0.5ZM25.8716 29L23.75 31.1216L12.6284 20L23.75 8.87844L25.8716 11L16.8716 20L25.8716 29Z" fill="#050505" />
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('back')}</Text>
                    </View>
                    <VerifyPinModal visible={showPinModal} callback={handleVerifySuccess} onClose={() => setShowPinModal(false)} />
                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatar} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.profileName}>{user?.full_name}</Text>
                            <Text style={styles.profileEmail}>{user?.email}</Text>
                        </View>
                    </View>

                    {/* Section Title */}
                    <Text style={styles.sectionTitle}>{t('account_security')}</Text>

                    {/* Change PIN */}
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowPinModal(true)}>
                        <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <Path d="M18.0375 6.7126C20.6875 6.7126 23.1875 7.2816 25.5375 8.4196C27.8875 9.5576 29.85 11.2011 31.425 13.3501C31.6 13.5751 31.6565 13.7751 31.5945 13.9501C31.5325 14.1251 31.426 14.2751 31.275 14.4001C31.124 14.5251 30.949 14.5816 30.75 14.5696C30.551 14.5576 30.376 14.4511 30.225 14.2501C28.85 12.3001 27.0815 10.8066 24.9195 9.7696C22.7575 8.7326 20.4635 8.2136 18.0375 8.2126C15.6115 8.2116 13.3365 8.7306 11.2125 9.7696C9.0885 10.8086 7.326 12.3021 5.925 14.2501C5.775 14.4751 5.6 14.6001 5.4 14.6251C5.2 14.6501 5.025 14.6001 4.875 14.4751C4.7 14.3501 4.5935 14.1941 4.5555 14.0071C4.5175 13.8201 4.574 13.6261 4.725 13.4251C6.275 11.3001 8.219 9.6501 10.557 8.4751C12.895 7.3001 15.3885 6.7126 18.0375 6.7126ZM18.0375 10.2376C21.4125 10.2376 24.3125 11.3626 26.7375 13.6126C29.1625 15.8626 30.375 18.6501 30.375 21.9751C30.375 23.2251 29.9315 24.2691 29.0445 25.1071C28.1575 25.9451 27.076 26.3636 25.8 26.3626C24.524 26.3616 23.4305 25.9431 22.5195 25.1071C21.6085 24.2711 21.152 23.2271 21.15 21.9751C21.15 21.1501 20.844 20.4561 20.232 19.8931C19.62 19.3301 18.8885 19.0491 18.0375 19.0501C17.1865 19.0511 16.455 19.3326 15.843 19.8946C15.231 20.4566 14.925 21.1501 14.925 21.9751C14.925 24.4001 15.644 26.4251 17.082 28.0501C18.52 29.6751 20.376 30.8126 22.65 31.4626C22.875 31.5376 23.025 31.6626 23.1 31.8376C23.175 32.0126 23.1875 32.2001 23.1375 32.4001C23.0875 32.5751 22.9875 32.7251 22.8375 32.8501C22.6875 32.9751 22.5 33.0126 22.275 32.9626C19.675 32.3126 17.55 31.0186 15.9 29.0806C14.25 27.1426 13.425 24.7741 13.425 21.9751C13.425 20.7251 13.875 19.6751 14.775 18.8251C15.675 17.9751 16.7625 17.5501 18.0375 17.5501C19.3125 17.5501 20.4 17.9751 21.3 18.8251C22.2 19.6751 22.65 20.7251 22.65 21.9751C22.65 22.8001 22.9625 23.4941 23.5875 24.0571C24.2125 24.6201 24.95 24.9011 25.8 24.9001C26.65 24.8991 27.375 24.6181 27.975 24.0571C28.575 23.4961 28.875 22.8021 28.875 21.9751C28.875 19.0751 27.8125 16.6376 25.6875 14.6626C23.5625 12.6876 21.025 11.7001 18.075 11.7001C15.125 11.7001 12.5875 12.6876 10.4625 14.6626C8.3375 16.6376 7.275 19.0626 7.275 21.9376C7.275 22.5376 7.3315 23.2876 7.4445 24.1876C7.5575 25.0876 7.826 26.1376 8.25 27.3376C8.325 27.5626 8.319 27.7626 8.232 27.9376C8.145 28.1126 8.001 28.2376 7.8 28.3126C7.599 28.3876 7.4055 28.3816 7.2195 28.2946C7.0335 28.2076 6.902 28.0636 6.825 27.8626C6.45 26.8876 6.1815 25.9191 6.0195 24.9571C5.8575 23.9951 5.776 23.0011 5.775 21.9751C5.775 18.6501 6.9815 15.8626 9.3945 13.6126C11.8075 11.3626 14.6885 10.2376 18.0375 10.2376ZM18.0375 3.0376C19.6375 3.0376 21.2 3.2311 22.725 3.6181C24.25 4.0051 25.725 4.5616 27.15 5.2876C27.375 5.4126 27.5065 5.5626 27.5445 5.7376C27.5825 5.9126 27.5635 6.0876 27.4875 6.2626C27.4115 6.4376 27.2865 6.5751 27.1125 6.6751C26.9385 6.7751 26.726 6.7626 26.475 6.6376C25.15 5.9626 23.781 5.4441 22.368 5.0821C20.955 4.7201 19.5115 4.5386 18.0375 4.5376C16.5875 4.5376 15.1625 4.7066 13.7625 5.0446C12.3625 5.3826 11.025 5.9136 9.75 6.6376C9.55 6.7626 9.35 6.7941 9.15 6.7321C8.95 6.6701 8.8 6.5386 8.7 6.3376C8.6 6.1366 8.575 5.9556 8.625 5.7946C8.675 5.6336 8.8 5.4896 9 5.3626C10.4 4.6126 11.8625 4.0376 13.3875 3.6376C14.9125 3.2376 16.4625 3.0376 18.0375 3.0376ZM18.0375 13.8751C20.3625 13.8751 22.3625 14.6566 24.0375 16.2196C25.7125 17.7826 26.55 19.7011 26.55 21.9751C26.55 22.2001 26.4815 22.3816 26.3445 22.5196C26.2075 22.6576 26.026 22.7261 25.8 22.7251C25.6 22.7251 25.425 22.6566 25.275 22.5196C25.125 22.3826 25.05 22.2011 25.05 21.9751C25.05 20.1001 24.356 18.5316 22.968 17.2696C21.58 16.0076 19.9365 15.3761 18.0375 15.3751C16.1385 15.3741 14.5075 16.0056 13.1445 17.2696C11.7815 18.5336 11.1 20.1021 11.1 21.9751C11.1 24.0001 11.45 25.7191 12.15 27.1321C12.85 28.5451 13.875 29.9636 15.225 31.3876C15.375 31.5376 15.45 31.7126 15.45 31.9126C15.45 32.1126 15.375 32.2876 15.225 32.4376C15.075 32.5876 14.9 32.6626 14.7 32.6626C14.5 32.6626 14.325 32.5876 14.175 32.4376C12.7 30.8876 11.569 29.3066 10.782 27.6946C9.995 26.0826 9.601 24.1761 9.6 21.9751C9.6 19.7001 10.425 17.7811 12.075 16.2181C13.725 14.6551 15.7125 13.8741 18.0375 13.8751ZM18 21.2251C18.225 21.2251 18.4065 21.3001 18.5445 21.4501C18.6825 21.6001 18.751 21.7751 18.75 21.9751C18.75 23.8501 19.425 25.3876 20.775 26.5876C22.125 27.7876 23.7 28.3876 25.5 28.3876C25.65 28.3876 25.8625 28.3751 26.1375 28.3501C26.4125 28.3251 26.7 28.2876 27 28.2376C27.225 28.1876 27.419 28.2191 27.582 28.3321C27.745 28.4451 27.851 28.6136 27.9 28.8376C27.95 29.0376 27.9125 29.2126 27.7875 29.3626C27.6625 29.5126 27.5 29.6126 27.3 29.6626C26.85 29.7876 26.4565 29.8566 26.1195 29.8696C25.7825 29.8826 25.576 29.8886 25.5 29.8876C23.275 29.8876 21.3435 29.1376 19.7055 27.6376C18.0675 26.1376 17.249 24.2501 17.25 21.9751C17.25 21.7751 17.319 21.6001 17.457 21.4501C17.595 21.3001 17.776 21.2251 18 21.2251Z" fill="#333333" />
                        </Svg>
                        <Text style={styles.menuText}>{t('change_pin')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowChangePassword(true)}>
                        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <Path d="M23.3625 28H4.6375C3.045 28 1.75 26.705 1.75 25.1125V11.6375C1.75 10.045 3.045 8.75 4.6375 8.75H23.3625C24.955 8.75 26.25 10.045 26.25 11.6375V25.095C26.25 26.6875 24.955 27.9825 23.3625 27.9825V28ZM4.6375 10.5C4.0075 10.5 3.5 11.0075 3.5 11.6375V25.095C3.5 25.725 4.0075 26.2325 4.6375 26.2325H23.3625C23.9925 26.2325 24.5 25.725 24.5 25.095V11.6375C24.5 11.0075 23.9925 10.5 23.3625 10.5H4.6375Z" fill="#333333" />
                            <Path d="M21.945 10.5H6.055V7.945C6.055 3.57 9.625 0 14 0C18.375 0 21.945 3.57 21.945 7.945V10.5ZM7.805 8.75H20.195V7.945C20.195 4.5325 17.4125 1.75 14 1.75C10.5875 1.75 7.805 4.5325 7.805 7.945V8.75Z" fill="#333333" />
                            <Path d="M21 20.125C21.9665 20.125 22.75 19.3415 22.75 18.375C22.75 17.4085 21.9665 16.625 21 16.625C20.0335 16.625 19.25 17.4085 19.25 18.375C19.25 19.3415 20.0335 20.125 21 20.125Z" fill="#333333" />
                            <Path d="M14 20.125C14.9665 20.125 15.75 19.3415 15.75 18.375C15.75 17.4085 14.9665 16.625 14 16.625C13.0335 16.625 12.25 17.4085 12.25 18.375C12.25 19.3415 13.0335 20.125 14 20.125Z" fill="#333333" />
                            <Path d="M7 20.125C7.9665 20.125 8.75 19.3415 8.75 18.375C8.75 17.4085 7.9665 16.625 7 16.625C6.0335 16.625 5.25 17.4085 5.25 18.375C5.25 19.3415 6.0335 20.125 7 20.125Z" fill="#333333" />
                        </Svg>
                        <Text style={styles.menuText}>{t('change_password')}</Text>
                    </TouchableOpacity>

                    <ChangePasswordSheet visible={showChangePassword} onClose={() => setShowChangePassword(false)} />
                </View>
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
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#D9D9D9',
        marginRight: 16,
    },
    profileName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#222',
        marginBottom: 2,
    },
    profileEmail: {
        color: '#888',
        fontSize: 14,
        marginBottom: 2,
    },
    profilePhone: {
        color: '#888',
        fontSize: 14,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#444',
        marginLeft: 20,
        marginTop: 24,
        marginBottom: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        gap: 8,
        minHeight: 72,
    },
    menuText: {
        fontSize: 16,
        color: '#373B47',
    },
});
