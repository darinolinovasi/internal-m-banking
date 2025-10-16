import api from '@/api/api';
import { SecureStorage } from '@/utils/secureStorage';
import { useState } from 'react';

export function useLogout() {
    const [loading, setLoading] = useState(false);
    const logout = async () => {
        setLoading(true);
        const jwt = await SecureStorage.getJWT();
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
            await SecureStorage.logout();
            setLoading(false);
        } catch (err) {
            // Optionally handle error
            console.log('Logout error:', err);
            setLoading(false);
        }
    };
    return { logout, loading };
}
