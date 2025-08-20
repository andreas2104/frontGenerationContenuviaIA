import { Utilisateur } from "@/types/utilisateur";


const apiUrl = 'http://127.0.0.1:5000/api';

const getAuthHeaders = (token:string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchUtilisateurs = async (token: string): Promise<Utilisateur[]> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs`, {
      headers: getAuthHeaders(token)
    });
    if (!response.ok) {
      throw new Error('Erreur du chargement');
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la recuperation des utilisateurs:", error);
    throw error;
  };
};

export const getUtilisateurById = async (id: number, token: string): Promise<Utilisateur> => {
   try {
    const response = await fetch(`${apiUrl}/utilisateurs`, {
      headers: getAuthHeaders(token)
    });
    if (!response.ok) {
      throw new Error('Erreur du chargement');
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la recuperation des utilisateurs:", error);
    throw error;
  };
};

export const updateUtilisateur = async (utilisateur: Partial<Utilisateur>, token: string): Promise<Utilisateur> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/${utilisateur.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(utilisateur),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'utilisateur.');
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw error;
  }
};

export const deleteUtilisateur = async (id: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la suppression de l\'utilisateur.');
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
  }
};