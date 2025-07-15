// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dev-port-l6it.onrender.com/',
  withCredentials: true,
});

export default api;
