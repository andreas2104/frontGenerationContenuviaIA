export interface Projet {
  id: number;
  id_utilisateur: number;
  nom_projet: string;
  description?: string;
  date_creation: string;
  date_modification: string;
  status: "draft" | "published" | "archived";
  configuration?: Record<string>;
  
}

