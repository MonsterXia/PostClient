import axios from 'axios';

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
    return Promise.reject(error);
});

