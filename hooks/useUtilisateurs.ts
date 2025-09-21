import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Utilisateur } from "@/types/utilisateur";
import {
   deleteUtilisateur, 
    fetchCurrentUtilisateur,
    fetchUtilisateurs,
    updateUtilisateur } from "@/services/utilisateurService"


// const useAuth = () => {

//   const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1NTY5Nzk5NywianRpIjoiM2I4NjZiYTEtMzA5OC00ZDU1LTgzM2MtZTI1OTJjYTk2NTNjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzU1Njk3OTk3LCJjc3JmIjoiMjYxZWUxM2MtZjFkMS00YjkyLTljYTMtZTdiMTYzYTJhMTE1IiwiZXhwIjoxNzU1NzAxNTk3fQ.MbPLha10j3Qq9Zl-AzGzuJVpuAZiPFaCdHF8Uj0MTNc'; 
//   return { token };
// };
const useAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken'): null;

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  };
  return {
    token,
    isAuthenticated: !!token,
    logout
  };
  };

export const useCurrentUtilisateur = () => {
  const { token, isAuthenticated, logout } = useAuth();

  const {
    data: utilisateur,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['currentUtilisateur'],
    queryFn: fetchCurrentUtilisateur, // ✅ Pas besoin de passer le token, il est récupéré dans la fonction
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isAdmin = utilisateur?.type_compte === 'admin';

  // Logout automatique en cas d'erreur d'authentification
  if (error && !isLoading && isAuthenticated) {
    console.error('Erreur utilisateur, déconnexion automatique');
    logout();
  }

  return {
    utilisateur,
    isLoading,
    error,
    isAdmin,
    isAuthenticated,
    logout,
    refetch,
  };
};

export const useUtilisateurs = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const {isAdmin} = useCurrentUtilisateur();
  
  const {
    data: utilisateurs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['utilisateurs', token], 
    queryFn: () => fetchUtilisateurs(token!),
    enabled: !!token && isAdmin,
    refetchOnWindowFocus: false,
  });
 
  const updateMutation = useMutation({
    mutationFn: (utilisateur: Partial<Utilisateur>) => {
      if (!token) throw new Error('token manquant');
      return updateUtilisateur(utilisateur, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error('token manquant');
      return deleteUtilisateur(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
  });

  return {
    utilisateurs,
    isLoading,
    error,
    updateUtilisateur: updateMutation.mutate,
    deleteUtilisateur: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleing: deleteMutation.isPending,
  };
};
