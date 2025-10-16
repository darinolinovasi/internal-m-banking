import { SECURITY_CONFIG, SECURITY_HEADERS } from '@/config/security';
import { SecureStorage } from '@/utils/secureStorage';
import axios from 'axios';

const api = axios.create({
    baseURL: SECURITY_CONFIG.API_BASE_URL,
    timeout: SECURITY_CONFIG.API_TIMEOUT,
    headers: SECURITY_HEADERS,
});

// Add interceptor to include Authorization header if jwt exists
api.interceptors.request.use(async (config) => {
    const jwt = await SecureStorage.getJWT();
    if (jwt) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${jwt}`;
    }
    return config;
});

// Add response interceptor to handle token expiration and refresh
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        // Prevent infinite loop: do not retry if the request is to /auth/refresh
        if (originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
            await SecureStorage.removeSecureItem('jwt');
            await SecureStorage.removeSecureItem('refresh_token');
            return Promise.reject(error);
        }
        // Check if error is due to expired token and retry hasn't been attempted
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data.error !== 'Invalid PIN' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = await SecureStorage.getRefreshToken();
                if (!refreshToken) throw error;
                // Request new JWT using refresh token
                const refreshResponse = await api.post('/auth/refresh', { refresh_token: refreshToken });
                const newJwt = refreshResponse.data?.data?.jwt;
                const newRefreshToken = refreshResponse.data?.data?.refresh_token;
                if (!newRefreshToken) {
                    throw error;
                }
                if (newJwt) {
                    await SecureStorage.setJWT(newJwt);
                    await SecureStorage.setRefreshToken(newRefreshToken);
                    // Update Authorization header and retry original request
                    originalRequest.headers['Authorization'] = `Bearer ${newJwt}`;
                    return api(originalRequest);
                }
            } catch (refreshErr) {
                // Optionally clear tokens or handle logout here
                await SecureStorage.removeSecureItem('jwt');
                await SecureStorage.removeSecureItem('refresh_token');
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
