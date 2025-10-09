import { Historique, CreateHistoriqueEntry } from "@/types/historique";
import { apiClient } from "./clientService";

export const historiqueService = {
  /**
   * Récupère tous les historiques selon les permissions de l'utilisateur
   */
  async fetchAllHistoriques(): Promise<Historique[]> {
    console.log('📊 Récupération de tous les historiques...');
    return apiClient<Historique[]>('/historiques', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Récupère l'historique d'un contenu spécifique
   */
  async fetchHistoriqueByContenu(contenuId: number): Promise<Historique[]> {
    console.log(`📊 Récupération de l'historique pour le contenu ID: ${contenuId}`);
    return apiClient<Historique[]>(`/historiques/contenu/${contenuId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Crée une nouvelle entrée dans l'historique
   */
  async createHistoriqueEntry(historiqueData: CreateHistoriqueEntry): Promise<{ message: string; historique_id: number }> {
    console.log('📝 Création d\'une entrée d\'historique...');
    return apiClient<{ message: string; historique_id: number }>('/historiques', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historiqueData),
    });
  },

  /**
   * Fonction utilitaire pour créer une entrée d'historique avec des paramètres communs
   */
  async logAction(
    typeAction: TypeActionEnum,
    description: string,
    options?: {
      idContenu?: number;
      idPlateforme?: number;
      donneesAvant?: Record<string, unknown>;
      donneesApres?: Record<string, unknown>;
    }
  ): Promise<boolean> {
    try {
      const historiqueData: CreateHistoriqueEntry = {
        id_utilisateur: await this.getCurrentUserId(), // À implémenter selon votre auth
        type_action: typeAction,
        description,
        id_contenu: options?.idContenu,
        id_plateforme: options?.idPlateforme,
        donnees_avant: options?.donneesAvant,
        donnees_apres: options?.donneesApres,
        ip_utilisateur: await this.getUserIP(), 
        user_agent: navigator.userAgent,
      };

      await this.createHistoriqueEntry(historiqueData);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'entrée d\'historique:', error);
      return false;
    }
  },

  /**
   * Méthodes utilitaires à adapter selon votre système d'authentification
   */
  async getCurrentUserId(): Promise<number> {
    // À implémenter selon votre système d'authentification
    // Exemple: récupérer depuis le store, localStorage, etc.
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    throw new Error('Utilisateur non authentifié');
  },

  async getUserIP(): Promise<string> {
    // À implémenter selon vos besoins
    // Peut utiliser un service externe ou récupérer depuis l'API
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }
};

// Export des fonctions individuelles pour une utilisation plus flexible
export const {
  fetchAllHistoriques,
  fetchHistoriqueByContenu,
  createHistoriqueEntry,
  logAction
} = historiqueService;