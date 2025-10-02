// Types de base
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
  date_creation: string;
  date_modification: string;
}

export interface PlateformeCreate {
  nom: string;
  config: {
    client_id: string;
    client_secret: string;
    scopes?: string[];
    [key: string]: any;
  };
  active?: boolean;
}

export interface PlateformeUpdate {
  nom?: string;
  config?: {
    client_id?: string;
    client_secret?: string;
    scopes?: string[];
    [key: string]: any;
  };
  active?: boolean;
}

// Types pour les connexions utilisateur
export interface UtilisateurPlateforme {
  id: number;
  utilisateur_id: number;
  plateforme_id: number;
  plateforme_nom: string;
  external_id: string | null;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  actif: boolean;
  date_connexion: string;
  derniere_synchronisation: string | null;
  meta: Record<string, any> | null;
}

// Types pour OAuth
export interface OAuthInitResponse {
  auth_url: string;
  state: string;
}

export interface OAuthCallbackResponse {
  message: string;
  data: UtilisateurPlateforme;
}

export interface OAuthState {
  id: number;
  state: string;
  utilisateur_id: number;
  plateforme_id: number;
  date_creation: string;
  date_expiration: string;
  utilise: boolean;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PlateformeResponse extends ApiResponse {
  data?: PlateformeConfig;
}

export interface PlateformesResponse extends ApiResponse {
  data?: PlateformeConfig[];
}

export interface ConnexionResponse extends ApiResponse {
  data?: UtilisateurPlateforme;
}

export interface ConnexionsResponse extends ApiResponse {
  data?: UtilisateurPlateforme[];
}

// Énums
export enum PlateformeNom {
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  // Ajoutez d'autres plateformes selon vos besoins
}

export enum StatutConnexion {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIREE = 'expiree',
  ERREUR = 'erreur'
}

// Types utilitaires
export type PlateformeWithConnexion = PlateformeConfig & {
  connexion?: UtilisateurPlateforme;
  estConnecte: boolean;
};

export interface ConnexionStatus {
  plateforme_nom: string;
  estConnecte: boolean;
  derniereSynchronisation?: string;
  statut: StatutConnexion;
}