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
    // Always resolve the base URL at request time so a change to the server
    // address (custom_server_url) takes effect immediately, without needing a
    // full app reload / re-init of the axios instance.
    config.baseURL = getApiBase();
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
        // Soft, client-side sign-out: the 'authChange' listener in App.jsx flips
        // isAuth and PrivateRoute navigates to /login via React Router. We must
        // NOT do a hard window.location redirect here — in the Capacitor WebView
        // that tries to load "/login" as a document and white-screens the app.
        window.dispatchEvent(new Event('authChange'));
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

// DEMO MODE: no login required — always treat the session as authenticated so
// every page is browsable when showing the app. Real data still loads whenever a
// token is present (App.jsx signs in as the demo user silently on startup).
export const isAuthenticated = () => true;
