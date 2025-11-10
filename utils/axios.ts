import axios from 'axios';

import { toast } from 'sonner-native';

// lib
import { authClient } from '@/lib/auth-client';

const instance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
  withCredentials: false,
});

// request interceptor
instance.interceptors.request.use(
  async (config: any) => {
    const cookies = authClient.getCookie();

    if (cookies) {
      config.headers = config.headers || {};

      config.headers.Cookie = cookies;
      config.credentials = 'omit';
    }

    return config;
  },
  (error: any) => Promise.reject(error),
);

// response interceptor
instance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    console.log('AXIOS ERROR', error);

    if (error.response.status === 401) {
      toast.error('Unauthorized', {
        description: 'Your session has expired, please login again.',
      });

      try {
        authClient.signOut();
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const message = error.response.data.message;

      // toast.error(message || 'Something went wrong');
      console.log('AXIOS ERROR MESSAGE', message);
    } catch (err) {
      toast.error(error.response.data.message || 'Something went wrong');
    }

    return Promise.reject(error?.response?.data || 'Something went wrong');
  },
);

export default instance;
