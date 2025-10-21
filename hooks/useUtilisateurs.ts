import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Utilisateur } from "@/types/utilisateur";
import {
  fetchCurrentUtilisateur,
  fetchUtilisateurs,
  updateUtilisateur,
  deleteUtilisateur,
} from "@/services/utilisateurService";


const useAuth = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
  };

  return {
    token,
    isAuthenticated: !!token,
    logout,
  };
};


export const useCurrentUtilisateur = () => {
  const { token, isAuthenticated, logout } = useAuth();

  const {
    data: utilisateur,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUtilisateur"],
    queryFn: fetchCurrentUtilisateur, 
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isAdmin = utilisateur?.type_compte === "admin";

  // Déconnexion auto si erreur d'auth
  if (error && !isLoading && isAuthenticated) {
    console.error("Erreur utilisateur, déconnexion automatique");
    logout();
  }

  return {
    utilisateur,
    isAdmin,
    isLoading,
    isAuthenticated,
    error,
    logout,
    refetch,
  };
};


export const useUtilisateurs = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { isAdmin } = useCurrentUtilisateur();

 
  const {
    data: utilisateurs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["utilisateurs", token],
    queryFn: () => fetchUtilisateurs(token!),
    enabled: !!token && isAdmin, 
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (utilisateur: Partial<Utilisateur>) => {
      if (!token) throw new Error("Token manquant");
      return updateUtilisateur(utilisateur, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("Token manquant");
      return deleteUtilisateur(id, token);
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
