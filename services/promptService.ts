import { Prompt } from "@/types/prompt";

const apiUrl = 'http://127.0.0.1:5000/api';

export const fetchPrompt = async (): Promise<Prompt[]> => {
  try {
    const response = await fetch(`${apiUrl}/prompts`);
    if(!response.ok) {
      throw new Error(`erreur du chargement prompt`);
    }
    return response.json();
  } catch (error) {
    console.error("error lors du recuperation")
    throw error;
  }
};

export const addPrompt = async (prompt: Prompt): Promise<{ message: string; prompt_id: number}> => {
  try {
    const response = await fetch(`${apiUrl}/prompts`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });
    if (!response.ok){
      throw new Error("erreur creation");
    }
    return response.json();
  } catch (error) {
    console.error('Erreur lors de la creation du prompt');
    throw error;
  }
}

export const updatePrompt = async (prompt: Prompt): Promise<Prompt[]> => {
  try {
    const response = await fetch(`${apiUrl}/prompts/${prompt.id}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });
    if(!response.ok) {
      throw new Error(`Erreur de chargement`);
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise a jour du projet:", error);
    throw error ;
  }
}

export const deletePrompt = async (id:number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/prompts/${id}`,{
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur de suppression');
    }
} catch(error) {
  console.error('Erreur lors de la suppression du prompt:', error);
  throw error;
}
}