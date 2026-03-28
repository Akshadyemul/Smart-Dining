import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the user ID in the headers
api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
            config.headers['x-user-id'] = user.id;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
