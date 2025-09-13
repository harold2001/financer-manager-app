import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

api.interceptors.request.use(async config => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
