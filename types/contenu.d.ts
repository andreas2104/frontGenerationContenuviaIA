export type TypeContenu = "text" | "image"; 

export interface Contenu {
  id: number;
  id_utilisateur: number;
  id_model: number;
  id_template?: number | null;
  id_prompt?: number | null;
  titre?: string | null;
  type_contenu: TypeContenu;
  texte?: string | null;
  image_url?: string | null;
  meta?: Record<string, unknown> | null;
  date_creation: string;
}


export interface ContenuPayload {
  id_prompt: number;
  id_model: number;
  id_template?: number;
  titre?: string;
}


export interface ContenuResponse {
  message: string;
  contenu: string;
  type: TypeContenu;
  id: number;
}
