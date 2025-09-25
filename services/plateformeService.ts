import { PlateformeConfig, PlateformeCreate, PlateformeUpdate } from "@/types/plateforme";
import { apiClient } from "./clientService";


export const fetchPlateformes = async (): Promise<PlateformeConfig[]> => {
  console.log("Récupération des plateformes...");
  return apiClient<PlateformeConfig[]>("/plateformes", {
    method: "GET",
  });
};


export const addPlateforme = async (
  plateforme: PlateformeCreate
): Promise<{ message: string; id: number }> => {
  console.log("Création d'une plateforme...");
  return apiClient<{ message: string; id: number }>("/plateformes", {
    method: "POST",
    body: JSON.stringify(plateforme),
  });
};


export const updatePlateforme = async (
  plateforme: PlateformeUpdate & { id: number }
): Promise<{ message: string }> => {
  console.log("Mise à jour de la plateforme ID:", plateforme.id);
  return apiClient<{ message: string }>(`/plateformes/${plateforme.id}`, {
    method: "PUT",
    body: JSON.stringify(plateforme),
  });
};


export const deletePlateforme = async (id: number): Promise<{ message: string }> => {
  console.log("Suppression de la plateforme ID:", id);
  return apiClient<{ message: string }>(`/plateformes/${id}`, {
    method: "DELETE",
  });
};
