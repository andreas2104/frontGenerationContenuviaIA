import { login, register, AuthResponse, LoginData, RegisterData } from '@/services/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook pour la connexion.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data: AuthResponse) => {
      // ✅ correction : on stocke access_token et pas data.token
      localStorage.setItem('access_token', data.access_token);
      if (data.utilisateur) {
        localStorage.setItem('user', JSON.stringify(data.utilisateur));
        queryClient.setQueryData(['user'], data.utilisateur);
      }

      console.log('Connexion réussie !');
    },
    onError: (error: any) => {
      console.error('Erreur de connexion:', error);
      alert(error.message || 'Erreur de connexion');
    },
  });
};

/**
 * Custom hook pour l'inscription.
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('access_token', data.access_token);
      if (data.utilisateur) {
        localStorage.setItem('user', JSON.stringify(data.utilisateur));
        queryClient.setQueryData(['user'], data.utilisateur);
      }

      console.log('Inscription réussie !');
    },
    onError: (error: any) => {
      console.error("Erreur d'inscription:", error);
      alert(error.message || 'Erreur lors de l’inscription');
    },
  });
};
