import { addContenu, deleteContenu, fetchAllContenu, updateContenu } from "@/services/contenuService";
import { Contenu } from "@/types/contenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContenu = () => {
  const queryClient = useQueryClient();

  const { data: contenus = [], isPending, error } = useQuery({
    queryKey: ['contenus'],
    queryFn: fetchAllContenu,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: (contenu: Contenu) => addContenu(contenu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (contenu: Contenu) => updateContenu(contenu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteContenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    },
  });

  return {
    contenus,
    isPending,
    error,
    addContenu: addMutation.mutate,
    updateContenu: updateMutation.mutate,
    deleteContenu: deleteMutation.mutate,
  };
};