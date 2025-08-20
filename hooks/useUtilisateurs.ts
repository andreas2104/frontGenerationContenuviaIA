import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Utilisateur } from "@/types/utilisateur";
import { deleteUtilisateur, fetchUtilisateurs, updateUtilisateur } from "@/services/utilisateurService
const useAuth = () => {
  
  const token = 'VOTRE_TOKEN_DE_TEST'; 
  return { token };
};

export const useUtilisateurs = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  
  const {
    data: utilisateurs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['utilisateurs', token], 
    queryFn: () => fetchUtilisateurs(token),
    enabled: !!token, 
    refetchOnWindowFocus: false,
  });
 
  const updateMutation = useMutation({
    mutationFn: (utilisateur: Partial<Utilisateur>) => {
  
      return updateUtilisateur(utilisateur, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
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
    deleteUtilisateur: deleteMutation.mutate
  };
};
