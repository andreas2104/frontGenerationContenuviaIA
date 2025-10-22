'use client';

import { apiClient } from "./clientService";
import { Utilisateur } from "@/types/utilisateur";

export const fetchCurrentUtilisateur = async (): Promise<Utilisateur | null> => {
  const response = await apiClient<{ utilisateur?: Utilisateur }>("/utilisateurs/me");
  console.log("user", response.utilisateur);
  return response.utilisateur || null;
};

// this is for an object array 
// export const fetchUtilisateurs = async (): Promise<Utilisateur[]> => {
//   const response = await apiClient<{ utilisateurs: Utilisateur[] }>("/utilisateurs", {
//   });
//   return response.utilisateurs || [];
// };

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

export const logoutUtilisateur = async (): Promise<{message: string}> => {
  return apiClient<{message: string}>(`/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  })
}