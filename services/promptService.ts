import { Prompt } from "@/types/prompt";
import { apiClient } from "./clientService";

export const fetchPrompt = async (): Promise<Prompt[]> => {
  console.log('Récupération des prompts...');
  const prompts =  apiClient<Prompt[]>('/prompts', {
    method: 'GET',
  });
return (await prompts).sort((a, b) => b.id - a.id);
};

export const addPrompt = async (prompt: Prompt): Promise<{ message: string; prompt_id: number }> => {
  console.log('Création d\'un prompt...');
  return apiClient<{ message: string; prompt_id: number }>('/prompts', {
    method: 'POST',
    body: JSON.stringify(prompt),
  });
};

export const updatePrompt = async (prompt: Prompt): Promise<{ message: string }> => {
  console.log('Mise à jour du prompt ID:', prompt.id);
  return apiClient<{ message: string }>(`/prompts/${prompt.id}`, {
    method: 'PUT',
    body: JSON.stringify(prompt),
  });
};

export const deletePrompt = async (id: number): Promise<{ message: string }> => {
  console.log('Suppression du prompt ID:', id);
  return apiClient<{ message: string }>(`/prompts/${id}`, {
    method: 'DELETE',
  });
};
