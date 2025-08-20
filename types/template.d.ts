export interface Template {
  id: number;
  id_utilisateur?: number | null;
  nom_template: string;
  structure: string;
  variables?: Record<string, unknown> | null;
  type_sortie: string;
  public: boolean;
  date_creation?: string | null;
}