export interface Projet {
  id: number;
  id_utilisateur: number;
  nom_projet: string;
  description?: string | null;
  date_creation: string;
  date_modification: string | null;
  status: "draft" | "active" | "archived";
  configuration?: Record<string, any> | null;
  
}
export interface ProjetCreate {
  id_utilisateur: number;
  nom_projet: string;
  description?: string | null;
  status?: "draft" | "active" | "archived";
  configuration?: Record<string, any> | null;
}
export interface ProjetUpdate {
id: number;
nom_projet: string;
description?: string | null;
status: "draft" | "active" | "archived";
configuration?: Record<string, any> | null;
}