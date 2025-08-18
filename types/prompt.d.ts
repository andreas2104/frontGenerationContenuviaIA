export interface Prompt {
  id: number;
  id_utilisateur: number;
  nom_prompt: string;
  texte_prompt: string;
  utilisation_count: number;
  parametres?: Record<string, any> | null ;
  public: boolean;
  date_creation: string;
  date_modification: string | null;
}

