import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Utilisateur } from "@/types/utilisateur";
import { addUtilisateur, deleteUtilisateur, fetchUtilisateurs, updateUtilisateur } from "@/services/utilisateurService";

export const useUtilisateurs = () => {
  const queryClient = useQueryClient();

  // return useQuery({
  //   queryKey: ['utilisateurs'],
  //   queryFn: fetchUtilisateurs,
  //   refetchOnWindowFocus: false,
  // })
  const {data: utilisateurs = [], isLoading, error}  = useQuery({
      queryKey: ['utilisateurs'],
      queryFn: fetchUtilisateurs,
      refetchOnWindowFocus: false,
  })
  
  const addMutation = useMutation({
    mutationFn: (utilisateur: Utilisateur) => addUtilisateur(utilisateur),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });}
  });

  const updateMutation = useMutation({
    mutationFn: (utilisateur: Utilisateur) => updateUtilisateur(utilisateur),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUtilisateur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    }
  });

  return {
    utilisateurs,
    isLoading,
    error,
    addUtilisateur: addMutation.mutate,
    updateUtilisateur: updateMutation.mutate,
    deleteUtilisateur: deleteMutation.mutate
  }
}