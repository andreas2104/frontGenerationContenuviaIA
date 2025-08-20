import { Projet, ProjetCreate, ProjetUpdate } from "@/types/projet";

const apiUrl = 'http://127.0.0.1:5000/api';

// export type ProjetCreate = Omit<Projet, 'id' | 'date_creation' | 'date_modification'>;

console.log("apiUrlmandeha:", apiUrl);
// export const fetchProjets = async (): Promise<Projet[]> => {
//   try {
//     const response = await fetch(`${apiUrl}/projets`);
//     if(!response.ok) {
//       throw new Error('Erreur du chargement');
//     }
//     const data = await response.json();
//     return data.map((p:Projet) => ({
//       id: p.id,
//       id_utilisateur: p.id_utilisateur,
//       nom_projet: p.nom_projet,
//       description: p.description || '',
//       date_creation: p.date_creation,
//       date_modification: p.date_modification,
//       status: p.status || 'draft',
//       configuration: p.configuration || {},
//     }));
//   } catch (error) {
//     console.error("Erreur lors de la recuperation des Projets:",error);
//     throw error;
//   } 
// }
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
// export const addProjet = async tr(projet: ProjetCreate): Promise<Projet> => {
//   console.log("Donnees envoiees vesr backend:", projet);
//   try {
//     const response = await fetch(`${apiUrl}/projets`, {
//       method: 'POST',
//       headers: {
//         'Content-Type':'application/json',
//       },
//       body: JSON.stringify(projet),
//     });
//     if (!response.ok) {
//       const errorData = await response.text();
//       console.error('Erreur détaillée:', errorData);
//       throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//     }
//     return response.json();
//   } catch (error) {
//     console.error("Erreur lors de la creation du projet:", error);
//     throw error;
//   }
// }

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
