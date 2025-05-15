import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const request = axios.create({
    baseURL: process.env.NODE_ENV === 'production'? "https://api.post.246801357.xyz": "http://localhost:8787",
    timeout: 10000,
});

request.interceptors.request.use((config) => {

    return config;
}, (error) => {
    return Promise.reject(error);
});

request.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
            console.error('Unauthorized access:', data);
            const { message: errMessage } = data;
            const navigate = useNavigate();
            if (errMessage) {
                if (errMessage === 'Invalid username or password') {
                    console.error('Login failed, you have to check your username and password');
                }
            }else {
                navigate('/server/login');
            }
        }
    }
    return Promise.reject(error);
});

