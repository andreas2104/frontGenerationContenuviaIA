import { Projet } from "@/types/projet";

const apiUrl = 'http://127.0.0.1:5000/api';

export const fetchProjets = async (): Promise<Projet[]> => {
  try {
    const response = await fetch(`${apiUrl}/projets`);
    if(!response.ok) {
      throw new Error('Erreur du chargement');
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la recuperation des Projets:",error);
    throw error;
  } 
}

export const addProjet = async (projet: Projet): Promise<Projet[]> => {
  try {
    const response = await fetch(`${apiUrl}/projets`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify(projet),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\ajout du projet');
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la creation du projet:", error);
    throw error;
  }
}