export type TypeContenu = "text" | "image" | "video" | "multimodal";

export interface Contenu {
  id: number;
  id_utilisateur: number;
  id_projet: number;
  id_model: number;
  id_template?: number | null;
  id_prompt?: number | null;
  titre?: string | null;
  type_contenu: TypeContenu;
  texte?: string | null;
  image_url?: string | null;
  contenu_structure?: {  
    blocs?: Array<{
      type: string;
      contenu?: string;
      url?: string;
      description?: string;
      role?: string;
    }>;
  } | null;
  meta?: {
    source?: string;
    date?: string;
    has_images?: boolean;      
    image_count?: number;
    [key: string]: unknown;    
  } | null;
  date_creation: string;
}

export interface ContenuPayload {
  id_projet: number;
  id_prompt: number;
  id_model: number;
  id_template?: number;
  titre?: string;
  images?: Array<{           
    url?: string;
    base64?: string;
    mime_type?: string;
  }>;
}

export interface ContenuResponse {
  message: string;
  contenu: string;
  titre: string;
  type: TypeContenu;
  id: number;
  structure?: {              
    blocs?: Array<{
      type: string;
      contenu?: string;
      url?: string;
      description?: string;
      role?: string;
    }>;
  } | null;
}