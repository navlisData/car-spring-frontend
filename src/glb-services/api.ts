import axios from 'axios';

const api = axios.create({

  baseURL: `${import.meta.env.VITE_BACKEND_HOST}:9090`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;