'use client';

import { Contenu, ContenuPayload } from "@/types/contenu";
import { 
  fetchContenus, 
  getContenuById, 
  generateContenu, 
  updateContenu, 
  deleteContenu 
} from "@/services/contenuService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContenu = () => {
  const queryClient = useQueryClient();

  const { data: contenus = [], isPending, error } = useQuery({
    queryKey: ['contenus'],
    queryFn: fetchContenus,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: (payload: ContenuPayload) => generateContenu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Contenu> }) => 
      updateContenu(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteContenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    }
  });

  return {
    contenus, 
    isPending,
    error,
    generateContenu: addMutation.mutate,
    updateContenu: updateMutation.mutate,
    deleteContenu: deleteMutation.mutate,
  };
};

export const useContenuById = (id?: number) => {
  const { data: contenu, isPending, error } = useQuery({
    queryKey: ['contenu', id],
    queryFn: () => {
      if (!id) throw new Error('ID du contenu requis');
      return getContenuById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return { contenu, isPending, error };
};

export const useGenerateContenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContenuPayload) => generateContenu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenus'] });
    }
  });
};