import axios from 'axios';

// Configuración de Axios para conectar al backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gameTrackerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('gameTrackerToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de API
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('gameTrackerToken');
  },
  
  getToken: () => {
    return localStorage.getItem('gameTrackerToken');
  },
  
  setToken: (token) => {
    localStorage.setItem('gameTrackerToken', token);
  }
};

export const gamesService = {
  getGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },
  
  createGame: async (gameData) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },
  
  updateGame: async (id, gameData) => {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  },
  
  deleteGame: async (id) => {
    const response = await api.delete(`/games/${id}`);
    return response.data;
  },
  
  getGameReviews: async (gameId) => {
    const response = await api.get(`/games/${gameId}/reviews`);
    return response.data;
  },
  
  createReview: async (gameId, reviewData) => {
    const response = await api.post(`/games/${gameId}/reviews`, reviewData);
    return response.data;
  }
};

export const healthService = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;