import { Contenu } from "@/types/contenu";
const apiUrl = 'http://127.0.0.1:5000/api';

export interface ContenuPayload {
  id_utilisateur: number;
  id_prompt: number;
  id_model: number;
  id_template?: number;
  titre?: string;
}

export interface ContenuResponse {
  message: string;
  contenu: string;
  type: string;
}


export const fetchAllContenu = async (): Promise<Contenu[]> => {
  try {
    const response = await fetch(`${apiUrl}/contenu`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des contenus.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des contenus :", error);
    throw error;
  }
};

export const addContenu = async (contenu: Contenu): Promise<{ message: string; contenu_id: number }> => {
  try {
    const response = await fetch(`${apiUrl}/contenu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contenu),
    });
    if (!response.ok) {
      throw new Error("Erreur de création du contenu.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la création du contenu :", error);
    throw error;
  }
};

export const updateContenu = async (contenu: Contenu): Promise<Contenu> => {
  try {
    const response = await fetch(`${apiUrl}/contenu/${contenu.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contenu),
    });
    if (!response.ok) {
      throw new Error("Erreur de mise à jour du contenu.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contenu :", error);
    throw error;
  }
};

export const deleteContenu = async (contenuId: number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/contenu/${contenuId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error("Erreur de suppression du contenu.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du contenu :", error);
    throw error;
  }
};


export const generateContenu = async (payload: ContenuPayload): Promise<ContenuResponse> => {
  try {
    const response = await fetch(`${apiUrl}/generer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la génération du contenu.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la génération du contenu :", error);
    throw error;
  }
};