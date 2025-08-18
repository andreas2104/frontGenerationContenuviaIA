export interface ModelIA {
  id: number;
  nom_model: string;
  type_model: "text"| "image"| "multimodal";
  fournisseur: string;
  api_endpoint: string;
  parametres_default?: Record<string, undefined> | null;
  cout_par_token: number;
  actif: boolean;
}