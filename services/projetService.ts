import { Projet, ProjetCreate, ProjetUpdate } from "@/types/projet";

const apiUrl = 'http://127.0.0.1:5000/api';

console.log("apiUrlmandeha:", apiUrl);

export const fetchProjets = async (): Promise<Projet[]> => {
  try {
    const response = await fetch(`${apiUrl}/projets`);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des projets: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    throw error;
  }
};

export const addProjet = async (projet: ProjetCreate): Promise<{ message: string; projet_id: number }> => {
  try {
    const response = await fetch(`${apiUrl}/projets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projet),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur ${response.status}: ${errorData || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    throw error;
  }
}

  export const updateProjet = async (projet: ProjetUpdate): Promise<Projet> => {
    try {
      const response = await fetch(`${apiUrl}/projets/${projet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projet),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du projet');
        }
      return response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du projet:", error);
      throw error;
    }   
}
 
export const deleteProjet = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/projets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du projet');
    }
  }
  catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    throw error;
  }
}
