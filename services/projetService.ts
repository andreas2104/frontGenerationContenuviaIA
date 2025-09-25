import { Projet, ProjetCreate, ProjetUpdate } from "@/types/projet";
import { apiClient } from "./clientService";

export const fetchProjets = async (): Promise<Projet[]> => {
  console.log("Récupération des projets...");
  return apiClient<Projet[]>("/projets", {
    method: "GET",
  });
};

export const addProjet = async (projet: ProjetCreate): Promise<{ message: string; projet_id: number }> => {
  console.log("Création d'un projet...");
  return apiClient<{ message: string; projet_id: number }>("/projets", {
    method: "POST",
    body: JSON.stringify(projet),
  });
};

export const updateProjet = async (projet: ProjetUpdate): Promise<{ message: string }> => {
  console.log("Mise à jour du projet ID:", projet.id);
  return apiClient<{ message: string }>(`/projets/${projet.id}`, {
    method: "PUT",
    body: JSON.stringify(projet),
  });
};

export const deleteProjet = async (id: number): Promise<{ message: string }> => {
  console.log("Suppression du projet ID:", id);
  return apiClient<{ message: string }>(`/projets/${id}`, {
    method: "DELETE",
  });
};
