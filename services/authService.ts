import { apiClient } from "./clientService";

const AUTH_ENDPOINT = "/auth"; 

export interface AuthResponse {
  message: string;
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

export interface LogoutResponse {
  message: string;
}

// Opérations d'authentification
export const login = async (data: LoginData): Promise<AuthResponse> => {
  return await apiClient<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return await apiClient<AuthResponse>(`${AUTH_ENDPOINT}/register`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });
};

// DÉCONNEXION UNIFIÉE - seule fonction de logout
export const logout = async (): Promise<LogoutResponse> => {
  return await apiClient<LogoutResponse>(`${AUTH_ENDPOINT}/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const fetchCurrentUtilisateur = async (): Promise<any> => {
  const response = await apiClient<{ utilisateur: any }>(`${AUTH_ENDPOINT}/me`, {
    credentials: "include",
  });
  return response.utilisateur;
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const res = await apiClient(`${AUTH_ENDPOINT}/me`, {
      credentials: "include",
    });
    return !!res.utilisateur;
  } catch {
    return false;
  }
};

/**
 * Connexion Google (redirection OAuth)
 */
const OAuth_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!OAuth_BASE_URL) {
  console.error('API URL UNDEFINED');
}

export const googleLoginRedirect = () => {
  window.location.href = `${OAuth_BASE_URL}/oauth/login/google`;
};

export const xLoginRedirect = () => {
  window.location.href = `${OAuth_BASE_URL}/oauth/login/x`;
};