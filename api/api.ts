import axios from 'axios';

const api = axios.create({
    baseURL: 'https://77d3d2bfacef.ngrok-free.app/api/v1/', // Change to your API base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
