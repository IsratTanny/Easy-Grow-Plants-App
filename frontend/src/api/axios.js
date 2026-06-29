import axios from 'axios';
import { getApiBase } from '../utils/platform';

// Django API Client
export const api = axios.create({
    baseURL: getApiBase(),
    headers: {
        'Content-Type': 'application/json',
    }
});

// Unified API Client (IoT and Main)
export const iotApi = axios.create({
    baseURL: getApiBase(),
    headers: {
        'Content-Type': 'application/json',
    }
});

const authInterceptor = (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

api.interceptors.request.use(authInterceptor);
iotApi.interceptors.request.use(authInterceptor);

// Globally handle expired/invalid sessions: clear the token and bounce to login
// (skipping the auth endpoints so a wrong password doesn't trigger a loop).
const responseErrorInterceptor = (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');
    if (status === 401 && !isAuthEndpoint) {
        clearAuthToken();
        window.dispatchEvent(new Event('authChange'));
        if (window.location.pathname !== '/login') {
            window.location.assign('/login');
        }
    }
    return Promise.reject(error);
};

api.interceptors.response.use((r) => r, responseErrorInterceptor);
iotApi.interceptors.response.use((r) => r, responseErrorInterceptor);

// Auth Helpers
export const setAuthToken = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};

export const clearAuthToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
}
