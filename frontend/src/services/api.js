import axios from 'axios';

const API = axios.create({
    baseURL: 'https://hms-7fm5.onrender.com/api', // Aapke Express Backend ka URL
    withCredentials: true // JWT Cookies bhejney ke liye zaroori hai
});

export default API;