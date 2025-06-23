// axiosInstance.js
import axios from 'axios';

// const baseURL = 'http://localhost:8000/api';

// const isDevelopment = import.meta.env.MODE === 'development'
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY
// const myBaseUrl =  import.meta.env.VITE_API_BASE_URL_LOCAL

const axiosInstance = axios.create({
  baseURL: myBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const user = JSON.parse(localStorage.getItem('user'));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      user?.refresh
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${myBaseUrl}/token/refresh/`, {
          refresh: user.refresh,
        });

        const newAccess = response.data.access;
        user.access = newAccess;

        localStorage.setItem('user', JSON.stringify(user));

        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
