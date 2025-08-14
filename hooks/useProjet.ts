import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addProjet, deleteProjet, fetchProjets, updateProjet } from "@/services/projetService";
import { Projet, ProjetCreate } from "@/types/projet";

export const useProjet  = () => {
  const queryClient = useQueryClient();

  const { data: projets = [], isLoading, error} = useQuery({
    queryKey: ['projets'],
    queryFn: fetchProjets,
    refetchOnWindowFocus: false,
  })

  const addMutation =  useMutation({
    mutationFn: (projet: ProjetCreate) => addProjet(projet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (projet: Projet) => updateProjet(projet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProjet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] });
    }
  });


  return {
    projets,
    isLoading,
    error,
    addProjet: addMutation.mutate,
    updateProjet: updateMutation.mutate,
    deleteProjet: deleteMutation.mutate
  }
}