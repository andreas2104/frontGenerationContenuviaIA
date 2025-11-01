import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Utilisateur } from "@/types/utilisateur";
import {
  fetchCurrentUtilisateur,
  fetchUtilisateurs,
  updateUtilisateur,
  deleteUtilisateur,
} from "@/services/utilisateurService";
import { logout } from "@/services/authService"; // Import depuis authService
import { useEffect } from "react";

/**
 * Hook pour la déconnexion unifié
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout, // Utilise la fonction unifiée de authService
    onSuccess: (data) => {
      console.log(data.message);
      // Nettoyer tout le cache
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ['currentUtilisateur'] });
      queryClient.removeQueries({ queryKey: ["utilisateurs"] });
      // Redirection
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error('Erreur de déconnexion:', error);
      // Même en cas d'erreur, on nettoie le cache local
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ['currentUtilisateur'] });
      queryClient.removeQueries({ queryKey: ["utilisateurs"] });
      window.location.href = "/login";
    },
  });
};

export const useCurrentUtilisateur = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  
  const {
    data: utilisateur,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUtilisateur"],
    queryFn: fetchCurrentUtilisateur, 
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isAdmin = utilisateur?.type_compte === "admin";

  // Déconnexion auto si erreur d'authentification
    useEffect(() => {
    if (error && !isLoading) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Se déconnecter seulement pour les erreurs d'authentification
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        console.error("Erreur d'authentification, déconnexion automatique");
        logout();
      }
    }
  }, [error, isLoading, logout]);

  return {
    utilisateur,
    isAdmin,
    isLoading: isLoading || isLoggingOut,
    error,
    logout,
    refetch,
  };
};

export const useUtilisateurs = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useCurrentUtilisateur();

  const {
    data: utilisateurs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["utilisateurs"],
    queryFn: fetchUtilisateurs,
    enabled: isAdmin, 
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (utilisateur: Partial<Utilisateur>) => {
      return updateUtilisateur(utilisateur);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
      // Invalider aussi le current utilisateur si on modifie le profil courant
      queryClient.invalidateQueries({ queryKey: ["currentUtilisateur"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteUtilisateur(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });

  return {
    utilisateurs,
    isLoading,
    error,
    updateUtilisateur: updateMutation.mutate,
    deleteUtilisateur: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};