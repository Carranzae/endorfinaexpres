import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://endorfinaexpres-production.up.railway.app';

// Retry configuration
interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout
});

// Enhanced request interceptor with auth token
api.interceptors.request.use(
    (config: RetryConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        config.retryCount = 0;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
    (response) => {
        // Clear retry count on success
        return response;
    },
    async (error: AxiosError) => {
        const config = error.config as RetryConfig;
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.dispatchEvent(new Event('unauthorized'));
            return Promise.reject(error);
        }
        
        // Retry logic for network errors and 5xx errors
        if (
            config &&
            (error.code === 'ECONNABORTED' ||
                error.code === 'ENOTFOUND' ||
                error.code === 'ERR_NETWORK' ||
                (error.response?.status && error.response.status >= 500))
        ) {
            config.retryCount = (config.retryCount || 0) + 1;
            
            if (config.retryCount <= MAX_RETRIES) {
                // Exponential backoff
                const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return api(config);
            }
        }
        
        return Promise.reject(error);
    }
);

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
    try {
        await api.get('/health', { timeout: 5000 }).catch(() => api.get('/auth/me', { timeout: 5000 }));
        return true;
    } catch {
        return false;
    }
};
