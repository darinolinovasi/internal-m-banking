import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useLogout() {
    const [loading, setLoading] = useState(false);
    const logout = async () => {
        setLoading(true);
        const jwt = await AsyncStorage.getItem('jwt');
        console.log('Logging out with JWT:', jwt);
        if (!jwt) {
            setLoading(false);
            return;
        }
        try {
            await api.post('/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization header will be added by interceptor if jwt exists
                    'Authorization': `Bearer ${jwt}`
                },
            });
            await AsyncStorage.removeItem('jwt');
            await AsyncStorage.removeItem('refresh_token');
            setLoading(false);
        } catch (err) {
            // Optionally handle error
            console.log('Logout error:', err);
        }
    };
    return { logout, loading };
}
