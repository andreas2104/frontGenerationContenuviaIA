'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchContenus,
  generateContenu,
  updateContenu,
  deleteContenu,
} from '@/services/contenuService';
import { Contenu, ContenuPayload, ContenuResponse } from '@/types/contenu';


export const useContenu = () => {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery<Contenu[], Error>({
    queryKey: ['contenus'],
    queryFn: fetchContenus,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteContenu,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contenus'] }),
  });

  return {
    contenus: data ?? [],
    isPending,
    error,
    deleteContenu: remove,
  };
};


export const useGenerateContenu = () => {
  const queryClient = useQueryClient();

  return useMutation<ContenuResponse, Error, ContenuPayload>({
    mutationFn: generateContenu,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contenus'] }),
  });
};


export const useUpdateContenu = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, Contenu>({
    mutationFn: updateContenu,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contenus'] }),
  });
};
