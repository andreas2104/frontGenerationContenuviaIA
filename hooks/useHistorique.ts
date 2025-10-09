// hooks/useHistorique.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllHistoriques, 
  fetchHistoriqueByContenu, 
  createHistoriqueEntry 
} from "@/services/historiqueService";
import { Historique, CreateHistoriqueEntry } from "@/types/historique";

export const useHistorique = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les historiques
  const { 
    data: historiques = [], 
    isPending, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['historiques'],
    queryFn: fetchAllHistoriques,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation pour créer une entrée d'historique
  const createMutation = useMutation({
    mutationFn: (historiqueData: CreateHistoriqueEntry) => 
      createHistoriqueEntry(historiqueData),
    onSuccess: () => {
      // Invalider et rafraîchir les données des historiques
      queryClient.invalidateQueries({ queryKey: ['historiques'] });
    },
  });

  return {
    historiques,
    isPending,
    error,
    refetchHistoriques: refetch,
    createHistorique: createMutation.mutate,
    createHistoriqueAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};

export const useHistoriqueByContenu = (contenuId: number | null) => {
  const queryClient = useQueryClient();

  const { 
    data: historiques = [], 
    isPending, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['historiques', 'contenu', contenuId],
    queryFn: () => {
      if (!contenuId) {
        throw new Error("ID du contenu requis");
      }
      return fetchHistoriqueByContenu(contenuId);
    },
    enabled: !!contenuId,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes pour l'historique spécifique
  });

  // Mutation pour créer un historique lié à un contenu spécifique
  const createMutation = useMutation({
    mutationFn: (historiqueData: CreateHistoriqueEntry) => 
      createHistoriqueEntry(historiqueData),
    onSuccess: (_, variables) => {
      // Invalider l'historique spécifique au contenu
      if (variables.id_contenu) {
        queryClient.invalidateQueries({ 
          queryKey: ['historiques', 'contenu', variables.id_contenu] 
        });
      }
      // Invalider aussi la liste générale des historiques
      queryClient.invalidateQueries({ queryKey: ['historiques'] });
    },
  });

  return {
    historiques,
    isPending,
    error,
    refetchHistoriques: refetch,
    createHistorique: createMutation.mutate,
    createHistoriqueAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};

// Hook pour les actions d'historique courantes
export const useHistoriqueActions = () => {
  const { createHistoriqueAsync } = useHistorique();

  const logAction = async (
    typeAction: string,
    description: string,
    options?: {
      idContenu?: number;
      idPlateforme?: number;
      donneesAvant?: Record<string, unknown>;
      donneesApres?: Record<string, unknown>;
    }
  ) => {
    try {
      // Récupérer l'ID utilisateur depuis le localStorage ou le contexte d'auth
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.warn('Utilisateur non authentifié pour la journalisation');
        return false;
      }

      const user = JSON.parse(userData);
      
      const historiqueData: CreateHistoriqueEntry = {
        id_utilisateur: user.id,
        type_action: typeAction,
        description,
        id_contenu: options?.idContenu,
        id_plateforme: options?.idPlateforme,
        donnees_avant: options?.donneesAvant,
        donnees_apres: options?.donneesApres,
        user_agent: navigator.userAgent,
        // Note: ip_utilisateur serait généralement récupéré côté serveur
      };

      await createHistoriqueAsync(historiqueData);
      return true;
    } catch (error) {
      console.error('Erreur lors de la journalisation:', error);
      return false;
    }
  };

  return {
    logAction,
  };
};