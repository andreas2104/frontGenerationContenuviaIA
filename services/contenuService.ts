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
    console.log('all content:', response);
    return response.json();
     
  } catch (error) {
    console.error("Erreur lors de la récupération des contenus :", error);
    throw error;
  }
};

export const generateContenu = async (payload: ContenuPayload): Promise<ContenuResponse> => {
  const r = await fetch(`${apiUrl}/contenu`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('Erreur lors de la generation du contenu');
  return r.json();
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


// export const updateContenu = async (contenu: Partial<Contenu> & { id: number }): Promise<{ message: string; contenu_id: number }> => {
//   const r = await fetch(`${apiUrl}/contenu/${contenu.id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify(contenu),
//   });
//   if (!r.ok) throw new Error('Erreur de mise à jour du contenu');
//   return r.json();
// };

// // DELETE
// export const deleteContenu = async (id: number): Promise<{ message: string }> => {
//   const r = await fetch(`${apiUrl}/contenu/${id}`, {
//     method: 'DELETE',
//     credentials: 'include',
//   });
//   if (!r.ok) throw new Error('Erreur de suppression du contenu');
//   return r.json();
// };