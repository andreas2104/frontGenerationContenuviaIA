import { Utilisateur } from "@/types/utilisateur";

const apiUrl = 'http://127.0.0.1:5000/api';

export interface AuthResponse {
  token: string;
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
 * @param {LoginData} data - L'email et le mot de passe de l'utilisateur.
 * @returns {Promise<AuthResponse>} - Le token d'authentification et les informations de l'utilisateur.
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/login`, {  // ✅ URL corrigée
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la connexion.');
    }

    return response.json();
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

/**
 * Fonction pour créer un nouveau compte utilisateur.
 * @param {RegisterData} data - Les informations d'inscription de l'utilisateur.
 * @returns {Promise<AuthResponse>} - Le token et les informations du nouvel utilisateur.
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${apiUrl}/utilisateurs/register`, {  // ✅ URL corrigée
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'inscription.');
    }

    return response.json();
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    throw error;
  }
};

/**
 * Démarre le flux d'authentification Google en redirigenant l'utilisateur.
 */
export const googleLoginRedirect = () => {
  // ✅ URL corrigée pour correspondre au backend
  window.location.href = `${apiUrl}/oauth/login/google`;
};

/**
 * Gère le callback Google et récupère le token
 */
// export const handleGoogleCallback = async (code: string): Promise<AuthResponse> => {
//   try {
//     const response = await fetch(`${apiUrl}/oauth/google/callback?code=${code}`, {
//       method: 'GET',
//       credentials: 'include',
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'Erreur lors de l\'authentification Google.');
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Erreur callback Google:", error);
//     throw error;
//   }
// };