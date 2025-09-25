// src/types/utilisateurPlateforme.ts
export type TypePlateforme = "facebook" | "linkedin";
export type StatutConnexion = "connecte" | "deconnecte" | "expire" | "erreur";

export interface UtilisateurPlateforme {
  id: number;
  utilisateur_id: number;
  plateforme_id: number;
  external_id?: string | null;
  access_token?: string | null;
  token_expires_at?: string | null; // ISO string
  meta?: Record<string, any> | null;
  created_at?: string | null;
  updated_at?: string | null;
  plateforme_nom?: TypePlateforme | string | null; // nom lisible de la plateforme
  token_valide?: boolean;
}
