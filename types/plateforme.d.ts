
 export interface PlateformeConfig {
  id: number;
  nom: string;
  config: {
    client_id: string;
    client_secret: string;
    scopes?: string[];
    [key: string]: any;
  };
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PlateformeCreate = Omit<PlateformeConfig, "id" | "created_at" | "updated_at">;

export type PlateformeUpdate = Partial<PlateformeCreate>;
