import { apiClient } from "./clientService";

const  AUTH_ENDPOINT = "/auth"; 

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  utilisateur: any;
}

export interface LoginData {
  email: string;
  mot_de_passe: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
}

/**
 * Connexion utilisateur
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  // On stocke le token pour les prochaines requêtes
  if (response.access_token) {
    localStorage.setItem("access_token", response.access_token);
  }

  return response;
};

/**
 * Inscription utilisateur
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>(`${AUTH_ENDPOINT}/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.access_token) {
    localStorage.setItem("access_token", response.access_token);
  }

  return response;
};

/**
 * Déconnexion → suppression du token
 */
export const logout = (): void => {
  localStorage.removeItem("access_token");
};

/**
 * Connexion Google (redirection OAuth)
 * consommed by 0auth route io e
 */

const OAuth_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!OAuth_BASE_URL) {
  console.error('API URL UNDEFINED');
}

export const googleLoginRedirect = () => {
  // window.location.href = "http://127.0.0.1:5000/api/oauth/login/google";
  window.location.href = `${OAuth_BASE_URL}/oauth/login/google`;
};


export const xLoginRedirect = () => {
  // window.location.href = "http://127.0.0.1:/5000/api/oauth/login/x";
  window.location.href = `${OAuth_BASE_URL}/oauth/login/x`;
};

