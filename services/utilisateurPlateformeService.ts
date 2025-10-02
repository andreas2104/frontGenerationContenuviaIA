// services/utilisateurPlateformeService.ts

import {
  UtilisateurPlateforme,
  OAuthInitiateResponse,
  TokenValidityResponse,
  UpdateMetaData,
  ApiResponse,
  CleanupStatesResponse,
} from "@/types/utilisateurPlateforme";
import { apiClient } from "./clientService";

/**
 * Récupère toutes les plateformes connectées de l'utilisateur
 */
export const fetchUserPlateformes = async (): Promise<UtilisateurPlateforme[]> => {
  console.log("Récupération des plateformes utilisateur...");
  return apiClient<UtilisateurPlateforme[]>("/plateformes", {
    method: "GET",
  });
};

/**
 * Récupère une connexion plateforme spécifique par son ID
 */
export const fetchUserPlateformeById = async (
  userPlateformeId: number
): Promise<UtilisateurPlateforme> => {
  console.log("Récupération de la plateforme utilisateur ID:", userPlateformeId);
  return apiClient<UtilisateurPlateforme>(`/plateformes/${userPlateformeId}`, {
    method: "GET",
  });
};

/**
 * Déconnecte un utilisateur d'une plateforme
 */
export const disconnectUserPlateforme = async (
  userPlateformeId: number
): Promise<ApiResponse> => {
  console.log("Déconnexion de la plateforme utilisateur ID:", userPlateformeId);
  return apiClient<ApiResponse>(`/plateformes/${userPlateformeId}`, {
    method: "DELETE",
  });
};

/**
 * Met à jour les métadonnées d'une connexion plateforme
 */
export const updateUserPlateformeMeta = async (
  userPlateformeId: number,
  data: UpdateMetaData
): Promise<ApiResponse<UtilisateurPlateforme>> => {
  console.log("Mise à jour des métadonnées de la plateforme ID:", userPlateformeId);
  return apiClient<ApiResponse<UtilisateurPlateforme>>(
    `/plateformes/${userPlateformeId}/meta`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
};

/**
 * Rafraîchit le token d'accès d'une connexion plateforme
 */
export const refreshUserPlateformeToken = async (
  userPlateformeId: number
): Promise<ApiResponse<UtilisateurPlateforme>> => {
  console.log("Rafraîchissement du token de la plateforme ID:", userPlateformeId);
  return apiClient<ApiResponse<UtilisateurPlateforme>>(
    `/plateformes/${userPlateformeId}/token`,
    {
      method: "PUT",
    }
  );
};

/**
 * Vérifie la validité du token d'une connexion plateforme
 */
export const checkTokenValidity = async (
  userPlateformeId: number
): Promise<TokenValidityResponse> => {
  console.log("Vérification de la validité du token de la plateforme ID:", userPlateformeId);
  return apiClient<TokenValidityResponse>(
    `/plateformes/${userPlateformeId}/check-token`,
    {
      method: "GET",
    }
  );
};

// ============================================
// GESTION OAUTH
// ============================================

/**
 * Initialise le flux OAuth pour une plateforme
 * Retourne l'URL d'autorisation vers laquelle rediriger l'utilisateur
 */
export const initiateOAuth = async (
  plateformeNom: string
): Promise<OAuthInitiateResponse> => {
  console.log("Initialisation OAuth pour la plateforme:", plateformeNom);
  return apiClient<OAuthInitiateResponse>(
    `/plateformes/oauth/${plateformeNom}/initiate`,
    {
      method: "GET",
    }
  );
};

/**
 * Redirige l'utilisateur vers l'URL d'autorisation OAuth
 * Cette fonction est appelée après initiateOAuth
 */
export const redirectToOAuth = async (plateformeNom: string): Promise<void> => {
  try {
    const response = await initiateOAuth(plateformeNom);
    if (response.auth_url) {
      // Rediriger vers l'URL d'autorisation
      window.location.href = response.auth_url;
    } else {
      throw new Error("URL d'autorisation non disponible");
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation OAuth:", error);
    throw error;
  }
};

/**
 * Gère le callback OAuth après retour de la plateforme
 * Note: Cette fonction n'est généralement pas appelée directement depuis le front-end
 * car le callback est géré par le backend. Elle est fournie pour référence.
 */
export const handleOAuthCallback = async (
  plateformeNom: string,
  code: string,
  state: string
): Promise<ApiResponse<UtilisateurPlateforme>> => {
  console.log("Traitement du callback OAuth pour:", plateformeNom);
  const params = new URLSearchParams({ code, state });
  return apiClient<ApiResponse<UtilisateurPlateforme>>(
    `/plateformes/oauth/${plateformeNom}/callback?${params.toString()}`,
    {
      method: "GET",
    }
  );
};

// ============================================
// GESTION ADMIN
// ============================================

/**
 * Nettoie les states OAuth expirés (réservé admin)
 */
export const cleanupExpiredStates = async (): Promise<CleanupStatesResponse> => {
  console.log("Nettoyage des states OAuth expirés...");
  return apiClient<CleanupStatesResponse>("/plateformes/admin/cleanup-states", {
    method: "POST",
  });
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Vérifie si un token est expiré côté client
 */
export const isTokenExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return true;
  const expirationDate = new Date(expiresAt);
  return expirationDate <= new Date();
};

/**
 * Obtient le temps restant avant expiration du token
 */
export const getTokenTimeRemaining = (expiresAt: string | null): number => {
  if (!expiresAt) return 0;
  const expirationDate = new Date(expiresAt);
  const now = new Date();
  const timeRemaining = expirationDate.getTime() - now.getTime();
  return Math.max(0, timeRemaining);
};

/**
 * Formate le temps restant en format lisible
 */
export const formatTokenTimeRemaining = (expiresAt: string | null): string => {
  const timeRemaining = getTokenTimeRemaining(expiresAt);
  if (timeRemaining === 0) return "Expiré";

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} jour${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
};

/**
 * Vérifie et rafraîchit automatiquement le token si nécessaire
 */
export const autoRefreshTokenIfNeeded = async (
  userPlateforme: UtilisateurPlateforme,
  refreshThresholdMinutes: number = 10
): Promise<UtilisateurPlateforme | null> => {
  const timeRemaining = getTokenTimeRemaining(userPlateforme.token_expires_at);
  const thresholdMs = refreshThresholdMinutes * 60 * 1000;

  // Si le token expire dans moins de X minutes, le rafraîchir
  if (timeRemaining > 0 && timeRemaining < thresholdMs) {
    console.log(
      `Token expire bientôt (${formatTokenTimeRemaining(
        userPlateforme.token_expires_at
      )}), rafraîchissement...`
    );
    try {
      const response = await refreshUserPlateformeToken(userPlateforme.id);
      return response.data || null;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement automatique:", error);
      return null;
    }
  }

  return null;
};