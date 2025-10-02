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

export const toggleModelActivation = async (id: number): Promise<{ message: string; modelIA_id: number; actif: boolean }> => {
  console.log("Activation/désactivation du modèle IA ID:", id);
  return apiClient<{ message: string; modelIA_id: number; actif: boolean }>(`/modelIA/${id}/toggle`, {
    method: "PATCH",
  });
};

export const fetchActiveModels = async (): Promise<ModelIA[]> => {
  console.log("Récupération des modèles IA actifs...");
  return apiClient<ModelIA[]>("/modelIA/active", {
    method: "GET",
  });
};

export const fetchModelsStats = async (): Promise<{
  total_models: number;
  active_models: number;
  text_models: number;
  image_models: number;
  providers: Record<string, number>;
}> => {
  console.log("Récupération des statistiques des modèles...");
  return apiClient<{
    total_models: number;
    active_models: number;
    text_models: number;
    image_models: number;
    providers: Record<string, number>;
  }>("/modelIA/stats", {
    method: "GET",
  });
};