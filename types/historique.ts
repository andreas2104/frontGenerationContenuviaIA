export enum TypeActionEnum {
  CREATION = "création",
  MODIFICATION = "modification",
  SUPPRESSION = "suppression",
  CONSULTATION = "consultation",
  PARTAGE = "partage",
  AUTRE = "autre"
}

export interface Historique {
  id: number;
  id_utilisateur: number;
  id_contenu?: number | null;
  id_plateforme?: number | null;
  type_action: TypeActionEnum;
  description: string;
  donnees_avant?: Record<string, unknown> | null;
  donnees_apres?: Record<string, unknown> | null;
  ip_utilisateur?: string | null;
  user_agent?: string | null;
  date_action: string;
}

export interface CreateHistoriqueEntry {
  id_utilisateur: number;
  type_action: TypeActionEnum;
  description: string;
  id_contenu?: number | null;
  id_plateforme?: number | null;
  donnees_avant?: Record<string, unknown> | null;
  donnees_apres?: Record<string, unknown> | null;
  ip_utilisateur?: string | null;
  user_agent?: string | null;
}