import { PlateformeConfig, PlateformeCreate, PlateformeUpdate, UtilisateurPlateforme } from "@/types/plateforme";
import { apiClient } from "./clientService";


export const fetchPlateformes = async (): Promise<PlateformeConfig[]> => {
  console.log("Récupération des plateformes...");
  const data = apiClient<PlateformeConfig[]>("/adminplateformes", {
    method: "GET",
  });
  console.log("dataplateforme", data);
  return data;
};

export const fetchPlateformeById = async (id: number): Promise<PlateformeConfig> => {
  console.log("Récupération de la plateforme ID:", id);
  return apiClient<PlateformeConfig>(`/adminplateformes/${id}`, {
    method: "GET",
  });
};

export const addPlateforme = async (
  plateforme: PlateformeCreate
): Promise<{ message: string; id: number }> => {
  console.log("Création d'une plateforme...");
  return apiClient<{ message: string; id: number }>("/adminplateformes", {
    method: "POST",
    body: JSON.stringify(plateforme),
  });
};


export const updatePlateforme = async (
  plateforme: PlateformeUpdate & { id: number }
): Promise<{ message: string }> => {
  console.log("Mise à jour de la plateforme ID:", plateforme.id);
  return apiClient<{ message: string }>(`/adminplateformes/${plateforme.id}`, {
    method: "PUT",
    body: JSON.stringify(plateforme),
  });
};

export const deletePlateforme = async (id: number): Promise<{ message: string }> => {
  console.log("Suppression de la plateforme ID:", id);
  return apiClient<{ message: string }>(`/adminplateformes/${id}`, {
    method: "DELETE",
  });
};


export const fetchConnexionsUtilisateur = async (): Promise<UtilisateurPlateforme[]> => {
  console.log("Récupération des connexions utilisateur...");
  return apiClient<UtilisateurPlateforme[]>("/utilisateur/connexions", {
    method: "GET",
  });
};

export const deconnecterPlateforme = async (plateformeNom: string): Promise<{ message: string }> => {
  console.log("Déconnexion de la plateforme:", plateformeNom);
  return apiClient<{ message: string }>(`/utilisateur/connexions/${plateformeNom}`, {
    method: "DELETE",
  });
};

// ========================================
// GESTION OAUTH
// ========================================

export const initierConnexionOAuth = async (plateformeNom: string): Promise<{ auth_url: string; state: string }> => {
  console.log("Initiation de la connexion OAuth pour:", plateformeNom);
  return apiClient<{ auth_url: string; state: string }>(`/oauth/${plateformeNom}/auth`, {
    method: "POST",
  });
};

export const callbackOAuth = async (plateformeNom: string, code: string, state: string): Promise<{ message: string; data: UtilisateurPlateforme }> => {
  console.log("Traitement du callback OAuth pour:", plateformeNom);
  return apiClient<{ message: string; data: UtilisateurPlateforme }>(`/oauth/${plateformeNom}/callback`, {
    method: "GET",
    // Note: En général, les paramètres code et state sont passés via query params par le provider OAuth
    // Si vous devez les passer manuellement, ajustez selon votre implémentation backend
  });
};

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Déconnecte l'utilisateur de toutes les plateformes
 */
export const deconnecterToutesPlateformes = async (): Promise<void> => {
  try {
    const connexions = await fetchConnexionsUtilisateur();
    const promises = connexions.map(connexion => 
      deconnecterPlateforme(connexion.plateforme_nom)
    );
    await Promise.all(promises);
    console.log("Déconnexion de toutes les plateformes réussie");
  } catch (error) {
    console.error("Erreur lors de la déconnexion de toutes les plateformes:", error);
    throw error;
  }
};

/**
 * Vérifie si l'utilisateur est connecté à une plateforme spécifique
 */
export const estConnecteAPlateforme = async (plateformeNom: string): Promise<boolean> => {
  try {
    const connexions = await fetchConnexionsUtilisateur();
    return connexions.some(connexion => 
      connexion.plateforme_nom === plateformeNom && connexion.actif
    );
  } catch (error) {
    console.error("Erreur lors de la vérification de connexion:", error);
    return false;
  }
};

/**
 * Récupère les plateformes disponibles pour connexion (plateformes actives)
 */
export const fetchPlateformesDisponibles = async (): Promise<PlateformeConfig[]> => {
  try {
    const plateformes = await fetchPlateformes();
    return plateformes.filter(p => p.active);
  } catch (error) {
    console.error("Erreur lors de la récupération des plateformes disponibles:", error);
    throw error;
  }
};