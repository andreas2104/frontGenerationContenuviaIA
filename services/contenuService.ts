'use client';

import { Contenu, ContenuPayload, ContenuResponse } from "@/types/contenu";
import { apiClient } from "./clientService";

export const fetchContenus = async (): Promise<Contenu[]> => {
  console.log("Récupération des contenus...");
  const contenus = await apiClient<Contenu[]>('/contenu', {
    method: 'GET',
  });
  return contenus.sort((a, b) => b.id - a.id);
};

export const getContenuById = async (id: number): Promise<Contenu> => {
  console.log("Récupération du contenu ID:", id);
  return apiClient<Contenu>(`/contenu/${id}`, {
    method: 'GET',
  });
};

export const generateContenu = async (payload: ContenuPayload): Promise<ContenuResponse> => {
  console.log("Génération de contenu...");
  return apiClient<ContenuResponse>('/contenu', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateContenu = async (
  id: number,
  updates: Partial<Pick<Contenu, "titre" | "texte" | "image_url" | "meta">>
): Promise<{ message: string; contenu_id: number }> => {
  console.log("Mise à jour du contenu ID:", id);
  return apiClient<{ message: string; contenu_id: number }>(`/contenu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteContenu = async (id: number): Promise<{ message: string }> => {
  console.log("Suppression du contenu ID:", id);
  return apiClient<{ message: string }>(`/contenu/${id}`, {
    method: 'DELETE',
  });
};