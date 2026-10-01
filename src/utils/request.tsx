import axios from 'axios';

// Login, session restoration, logout and binding all use HttpOnly cookies.
export const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://api.246801357.xyz' : 'http://localhost:8787'),
    timeout: 10000,
    withCredentials: true,
});
