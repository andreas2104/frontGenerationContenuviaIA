export interface UtilisateurPlateforme {
  id: number;
  utilisateur_id: number;
  plateforme_id: number;
  external_id: string | null;
  token_expires_at: string | null;
  meta: Record<string, any>;
  plateforme_nom: string | null;
  token_valide: boolean;
}

export interface PlateformeConfig {
  id: number;
  nom: string;
  config: {
    client_id: string;
    client_secret: string;
    scopes?: string[];
    auth_url?: string;
    token_url?: string;
    user_info_url?: string;
    [key: string]: any;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OAuthState {
  id: number;
  state: string;
  utilisateur_id: number;
  plateforme_id: number;
  created_at: string;
  used: boolean;
}

export interface OAuthInitiateResponse {
  auth_url: string;
  state: string;
}

export interface TokenValidityResponse {
  valid: boolean;
  expires_at: string | null;
  plateforme: string | null;
}

export interface AddUserPlateformeData {
  plateforme_nom: string;
  external_id?: string;
  access_token: string;
  expires_in?: number;
  meta?: Record<string, any>;
}

export interface UpdateTokenData {
  access_token: string;
  expires_in?: number;
  expires_at?: string;
}

export interface UpdateMetaData {
  meta: Record<string, any>;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export interface CleanupStatesResponse {
  message: string;
  count: number;
}