import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', // Aapke Express Backend ka URL
    withCredentials: true // JWT Cookies bhejney ke liye zaroori hai
});

export default API;