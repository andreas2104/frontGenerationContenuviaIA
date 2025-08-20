export interface Contenu {
  id: number;
  id_utilisateur: number;
  id_model: number;
  id_template?: number | null;
  id_prompt?: number | null;
  titre?: string | null;
  type_contenu: "text" | "video" | "image";
  texte?: string | null;
  image_url?: string | null;
  meta?: Record<string, unknown> | null;
  date_creation: string; 
}
