import { login , register, AuthResponse, LoginData, RegisterData } from '@/services/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
/**
 * Custom hook pour la connexion.
 * Gère l'état de la requête et met à jour le cache de l'utilisateur.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data: AuthResponse) => {
      // Stocke le token et les infos utilisateur (par ex., dans le localStorage)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.utilisateur));
      
      // Met à jour le cache de React Query avec les données de l'utilisateur
      // Cela permet de ne pas avoir à re-fetch les infos utilisateur ailleurs
      queryClient.setQueryData(['user'], data.utilisateur);
      
      // Tu peux aussi gérer ici la redirection de l'utilisateur
      // par exemple, vers la page d'accueil ou de profil.
      console.log('Connexion réussie !');
    },
    onError: (error) => {
      console.error('Erreur de connexion:', error);
      alert(error.message);
    },
  });
};

/**
 * Custom hook pour l'inscription.
 * Gère l'état de la requête et met à jour le cache de l'utilisateur après l'inscription.
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('authToken', data.token);

      queryClient.setQueryData(['user'], data.utilisateur);

      // Redirection après inscription réussie
      console.log('Inscription réussie !');
    },
    onError: (error) => {
      console.error('Erreur d\'inscription:', error);
      alert(error.message);
    },
  });
};