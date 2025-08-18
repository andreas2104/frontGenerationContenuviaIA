import { addPrompt, deletePrompt, fetchPrompt, updatePrompt } from "@/services/promptService";
import { Prompt } from "@/types/prompt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePrompt = () => {
  const queryClient = useQueryClient();

const {data: prompt = [],isPending,error } = useQuery({
    queryKey: ['prompt'],
    queryFn: fetchPrompt,
    refetchOnWindowFocus: false,
  })

const addMutation = useMutation({
    mutationFn: (prompt: Prompt) => addPrompt(prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt']});
    }
  });

const updateMutation = useMutation({
  mutationFn: (prompt: Prompt) => updatePrompt(prompt),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['prompt']});
  }
});

const deleteMutation = useMutation({
  mutationFn: (id: number) => deletePrompt(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['prompt']});
  } 
});

  return {
    prompt,
    isPending,
    error,
    addPrompt: addMutation.mutate,
    updatePrompt: updateMutation.mutate,
    deletePrompt: deleteMutation.mutate,
  }
}