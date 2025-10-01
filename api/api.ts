import axios from 'axios';

const api = axios.create({
    baseURL: 'https://e1ff4dd5e6ce.ngrok-free.app/api/v1/', // Change to your API base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
