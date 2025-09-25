import { Utilisateur } from "@/types/utilisateur";
import { apiClient } from "./clientService";

export const fetchCurrentUtilisateur = async (): Promise<Utilisateur> => {
  console.log('Récupération de l\'utilisateur actuel...');
  const data = apiClient<Utilisateur>('/utilisateurs/me', {
    method: 'GET',
  });
  console.log(data);
  return data;
};


export const fetchUtilisateurs = async (): Promise<Utilisateur[]> => {
  console.log('Récupération de tous les utilisateurs...');
  const data =  apiClient<Utilisateur[]>('/utilisateurs', {
    method: 'GET',
  });
  console.log("all data",data);
  return data;
};


export const updateUtilisateur = async (utilisateur: Partial<Utilisateur>): Promise<Utilisateur> => {
  console.log('Mise à jour de l\'utilisateur ID:', utilisateur.id);
  return apiClient<Utilisateur>(`/utilisateurs/${utilisateur.id}`, {
    method: 'PUT',
    body: JSON.stringify(utilisateur),
  });
};


export const deleteUtilisateur = async (id: number): Promise<{ message: string }> => {
  console.log('Suppression de l\'utilisateur ID:', id);
  return apiClient<{ message: string }>(`/utilisateurs/${id}`, {
    method: 'DELETE',
  });
};
