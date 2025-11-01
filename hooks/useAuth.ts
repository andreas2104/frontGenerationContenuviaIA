import { login, register, AuthResponse, LoginData, RegisterData, logout } from '@/services/authService';
import { fetchCurrentUtilisateur } from '@/services/utilisateurService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook pour la connexion.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data: AuthResponse) => {
      if (data.utilisateur) {
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
      if (data.utilisateur) {
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

export const usecurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUtilisateur,
    staleTime: 5 * 60 * 1000, 
  })
}

export const useLogout = () => {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data.message);
      queryclient.removeQueries({ queryKey: ['currentUtilisateur']});
      queryclient.removeQueries({ queryKey: ["utilisateurs"]});
      window.location.href = "/";
    },
    onError: (error) => {
      console.error('Erreur de deconnexion:', error);
    },
  });
};
