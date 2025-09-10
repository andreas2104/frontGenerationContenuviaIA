import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Utilisateur } from "@/types/utilisateur";
import { deleteUtilisateur, fetchUtilisateurs, updateUtilisateur } from "@/services/utilisateurService"
const useAuth = () => {

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1NTY5Nzk5NywianRpIjoiM2I4NjZiYTEtMzA5OC00ZDU1LTgzM2MtZTI1OTJjYTk2NTNjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzU1Njk3OTk3LCJjc3JmIjoiMjYxZWUxM2MtZjFkMS00YjkyLTljYTMtZTdiMTYzYTJhMTE1IiwiZXhwIjoxNzU1NzAxNTk3fQ.MbPLha10j3Qq9Zl-AzGzuJVpuAZiPFaCdHF8Uj0MTNc'; 
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
