// import { Utilisateur } from "@/types/utilisateur";


// const apiUrl = 'http://127.0.0.1:5000/api';

// const getAuthHeaders = (token:string) => {
//   return {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   };
// };

// export const fetchCurrentUtilisateur = async (token:string): Promise<Utilisateur> => {
//   try{
//     const response = await fetch(`${apiUrl}/utilisateurs/me`,{
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     if (!response.ok) {
//       if (response.status !== 401){
//         throw new Error('Session expiree');
//       }
//       throw new Error('Erreur lors de la recuperation des informations utilisateur');
//     }
//     return response.json();
//   } catch (error) {
//     console.error("Error lors de la recuperation de l'utilisateur actuel:", error);
//     throw error;
//   }

// }
// export const fetchUtilisateurs = async (token: string): Promise<Utilisateur[]> => {
//   try {
//     const response = await fetch(`${apiUrl}/utilisateurs`, {
//       headers: getAuthHeaders(token)
//     });
//     if (!response.ok) {
//       throw new Error('Erreur du chargement');
//     }
//     return response.json();
//   } catch (error) {
//     console.error("Erreur lors de la recuperation des utilisateurs:", error);
//     throw error;
//   };
// };

// export const getUtilisateurById = async (id: number, token: string): Promise<Utilisateur> => {
//    try {
//     const response = await fetch(`${apiUrl}/utilisateurs/${id}`, {
//       headers: getAuthHeaders(token)
//     });
//     if (!response.ok) {
//       throw new Error('Erreur du chargement');
//     }
//     return response.json();
//   } catch (error) {
//     console.error("Erreur lors de la recuperation des utilisateurs:", error);
//     throw error;
//   };
// };

// export const updateUtilisateur = async (utilisateur: Partial<Utilisateur>, token: string): Promise<Utilisateur> => {
//   try {
//     const response = await fetch(`${apiUrl}/utilisateurs/${utilisateur.id}`, {
//       method: 'PUT',
//       headers: getAuthHeaders(token),
//       body: JSON.stringify(utilisateur),
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'utilisateur.');
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
//     throw error;
//   }
// };

// export const deleteUtilisateur = async (id: number, token: string): Promise<void> => {
//   try {
//     const response = await fetch(`${apiUrl}/utilisateurs/${id}`, {
//       method: 'DELETE',
//       headers: getAuthHeaders(token)
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'Erreur lors de la suppression de l\'utilisateur.');
//     }
//   } catch (error) {
//     console.error("Erreur lors de la suppression de l'utilisateur:", error);
//     throw error;
//   }
// };

import { Utilisateur } from "@/types/utilisateur";

const apiUrl = 'http://127.0.0.1:5000/api';

// Fonction pour récupérer l'utilisateur actuel (AJOUTE CETTE FONCTION)
export const fetchCurrentUtilisateur = async (): Promise<Utilisateur> => {
  const token = localStorage.getItem('access_token'); // ✅ Utilise le même nom
  
  console.log('🔑 Récupération utilisateur actuel, token:', token ? 'présent' : 'absent');
  
  if (!token) {
    throw new Error('Aucun token d\'authentification trouvé');
  }

  try {
    const response = await fetch(`${apiUrl}/utilisateurs/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Statut récupération utilisateur:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Token expiré ou invalide');
        localStorage.removeItem('authToken');
        throw new Error('Session expirée');
      }
      if (response.status === 422) {
        console.error('❌ Erreur 422 - Probablement token malformé');
        localStorage.removeItem('authToken');
        throw new Error('Token invalide');
      }
      throw new Error(`Erreur ${response.status} lors de la récupération des informations utilisateur`);
    }

    const utilisateur = await response.json();
    console.log('✅ Utilisateur récupéré:', utilisateur.email);
    return utilisateur;
    
  } catch (error) {
    console.error("💥 Erreur lors de la récupération de l'utilisateur actuel:", error);
    throw error;
  }
};

// Fonction pour récupérer tous les utilisateurs (pour admin)
export const fetchUtilisateurs = async (token: string): Promise<Utilisateur[]> => {
  console.log('📡 Récupération de tous les utilisateurs...');
  
  try {
    const response = await fetch(`${apiUrl}/utilisateurs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée');
      }
      if (response.status === 403) {
        throw new Error('Accès refusé - Admin requis');
      }
      throw new Error(`Erreur ${response.status} lors de la récupération des utilisateurs`);
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }
};

// Fonction pour mettre à jour un utilisateur
export const updateUtilisateur = async (utilisateur: Partial<Utilisateur>, token: string): Promise<Utilisateur> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/${utilisateur.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(utilisateur),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status} lors de la mise à jour`);
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUtilisateur = async (id: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status} lors de la suppression`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
};