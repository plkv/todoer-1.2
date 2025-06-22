import axios from 'axios';
import { Task } from '@/types/Task';

// Получаем адрес backend динамически
const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  return 'http://localhost:3001';
};

const API_URL = getBackendUrl();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Очень важно для отправки cookies с каждым запросом
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Пользователь не аутентифицирован. 
      // Хук useAuth обработает этот случай и покажет кнопку входа.
      console.log('Not authenticated, redirecting will be handled by useAuth hook.');
    } else if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  }
};

type TaskData = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const tasks = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks');
    return response.data;
  },
  create: async (taskData: TaskData): Promise<Task> => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },
  update: async (id: string, taskData: Partial<TaskData>): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },
};

export default api; 