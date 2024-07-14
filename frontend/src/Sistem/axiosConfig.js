// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://registerwids.onrender.com' : 'http://localhost:3001'
});

export default instance;
