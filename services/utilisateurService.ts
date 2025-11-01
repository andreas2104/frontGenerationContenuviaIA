'use client';

import { apiClient } from "./clientService";
import { Utilisateur } from "@/types/utilisateur";

export const fetchCurrentUtilisateur = async (): Promise<Utilisateur | null> => {
  const response = await apiClient<{ utilisateur?: Utilisateur }>("/utilisateurs/me");
  console.log("user", response.utilisateur);
  return response.utilisateur || null;
};


export const fetchUtilisateurs = async (): Promise<Utilisateur[]> => {
  return apiClient<Utilisateur[]>(`/utilisateurs`, {
    method: "GET"
  });
}

export const updateUtilisateur = async (utilisateur: Partial<Utilisateur>): Promise<any> => {
  return apiClient(`/utilisateurs/${utilisateur.id}`, {
    method: "PUT",
    body: JSON.stringify(utilisateur),
  });
};

export const deleteUtilisateur = async (id: number): Promise<any> => {
  return apiClient(`/utilisateurs/${id}`, {
    method: "DELETE",
  });
};

