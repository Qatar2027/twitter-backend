import axios from 'axios';

const API = axios.create({
    baseURL: "https://twitter-api-vs6u.onrender.com/api",
});

// ميكانيزم وسيط لإضافة التوكن تلقائياً في رأس كل طلب إذا كان المستخدم مسجلاً لدخوله
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;