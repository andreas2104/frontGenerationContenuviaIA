import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: '/api', // ou votre URL d'API
  timeout: 10000,
});

// Intercepteur pour les requêtes - Ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses - Gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


import { useQuery } from '@tanstack/react-query';

export const useCatalog = () => {
  const prompts = useQuery({
    queryKey: ['prompts'],
    queryFn: () => api.get('/prompts').then(res => res.data),
  });

  const projets = useQuery({
    queryKey: ['projets'],
    queryFn: () => api.get('/projets').then(res => res.data),
  });

  const templates = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.get('/templates').then(res => res.data),
  });

  const models = useQuery({
    queryKey: ['models'],
    queryFn: () => api.get('/modelIA').then(res => res.data),
  });

  return {
    projets,
    prompts,
    templates,
    models,
    isPending: prompts.isPending || templates.isPending || models.isPending,
    isError: prompts.isError || templates.isError || models.isError,
  };
};