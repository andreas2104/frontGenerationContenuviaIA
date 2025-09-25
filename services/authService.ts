import { apiClient } from "./clientService";

const apiUrl = "/auth"; 

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
  const response = await apiClient<AuthResponse>(`${apiUrl}/login`, {
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
  const response = await apiClient<AuthResponse>(`${apiUrl}/register`, {
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
 */
export const googleLoginRedirect = () => {
  window.location.href = "http://127.0.0.1:5000/api/oauth/login/google";
};
