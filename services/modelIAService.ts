import { ModelIA } from "@/types/modelIA";
import { apiClient } from "./clientService";

export const fetchModelIA = async (): Promise<ModelIA[]> => {
  console.log("Récupération des modèles IA...");
  return apiClient<ModelIA[]>("/modelIA", {
    method: "GET",
  });
};

export const addModelIA = async (modelIA: ModelIA): Promise<{ message: string; modelIA_id: number }> => {
  console.log("Création d'un modèle IA...");
  return apiClient<{ message: string; modelIA_id: number }>("/modelIA", {
    method: "POST",
    body: JSON.stringify(modelIA),
  });
};

export const updateModelIA = async (modelIA: ModelIA): Promise<{ message: string }> => {
  console.log("Mise à jour du modèle IA ID:", modelIA.id);
  return apiClient<{ message: string }>(`/modelIA/${modelIA.id}`, {
    method: "PUT",
    body: JSON.stringify(modelIA),
  });
};

export const deleteModelIA = async (id: number): Promise<{ message: string }> => {
  console.log("Suppression du modèle IA ID:", id);
  return apiClient<{ message: string }>(`/modelIA/${id}`, {
    method: "DELETE",
  });
};
