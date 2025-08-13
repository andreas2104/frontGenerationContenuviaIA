import { Utilisateur } from "@/types/utilisateur";


const apiUrl = 'http://127.0.0.1:5000/api';

export const fetchUtilisateurs = async (): Promise<Utilisateur[]> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs`);
    if (!response.ok) {
      throw new Error('Erreur du chargement');
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la recuperation des utilisateurs:", error);
    throw error;
  }
}

export const addUtilisateur = async (utilisateur: Utilisateur): Promise<Utilisateur> => {
  try {
    const response  = await fetch(`${apiUrl}/utilisateurs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(utilisateur),
    });
    if (!response.ok) {   
      throw new Error('Erreur lors de l\'ajout de l\'utilisateur');
      } 
    return response.json();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    throw error;
  }
}

export const updateUtilisateur = async (utilisateur: Utilisateur): Promise<Utilisateur> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/${utilisateur.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(utilisateur),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    } 
    return response.json();
    } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw error;  
  }
}

export const deleteUtilisateur = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }   
  }
  catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
  }
}