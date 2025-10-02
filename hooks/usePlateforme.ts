import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPlateforme,
  deletePlateforme,
  fetchPlateformes,
  fetchPlateformeById,
  updatePlateforme,
  fetchConnexionsUtilisateur,
  deconnecterPlateforme,
  initierConnexionOAuth,
  fetchPlateformesDisponibles,
  estConnecteAPlateforme,
  deconnecterToutesPlateformes,
} from "@/services/plateformeService";
import {
  PlateformeConfig,
  PlateformeCreate,
  PlateformeUpdate,
  UtilisateurPlateforme,
  OAuthInitResponse,
  PlateformeNom,
} from "@/types/plateforme";


export const usePlateforme = () => {
  const queryClient = useQueryClient();

  const {
    data: plateformes = [],
    isLoading,
    error,
  } = useQuery<PlateformeConfig[], Error>({
    queryKey: ["plateformes"],
    queryFn: fetchPlateformes,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation<
    { message: string; id: number },
    Error,
    PlateformeCreate
  >({
    mutationFn: addPlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plateformes"] });
      queryClient.invalidateQueries({ queryKey: ["plateformes-disponibles"] });
    },
  });

  const updateMutation = useMutation<
    { message: string },
    Error,
    PlateformeUpdate & { id: number }
  >({
    mutationFn: updatePlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plateformes"] });
      queryClient.invalidateQueries({ queryKey: ["plateformes-disponibles"] });
    },
  });

  const deleteMutation = useMutation<
    { message: string },
    Error,
    number
  >({
    mutationFn: deletePlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plateformes"] });
      queryClient.invalidateQueries({ queryKey: ["plateformes-disponibles"] });
      queryClient.invalidateQueries({ queryKey: ["connexions-utilisateur"] });
    },
  });

  return {
    plateformes,
    isLoading,
    error,
    addPlateforme: addMutation.mutate,
    updatePlateforme: updateMutation.mutate,
    deletePlateforme: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const usePlateformeById = (id: number | null) => {
  return useQuery<PlateformeConfig, Error>({
    queryKey: ["plateforme", id],
    queryFn: () => fetchPlateformeById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};




export const usePlateformesDisponibles = () => {
  return useQuery<PlateformeConfig[], Error>({
    queryKey: ["plateformes-disponibles"],
    queryFn: fetchPlateformesDisponibles,
    refetchOnWindowFocus: false,
  });
};

// ========================================
// HOOK POUR LES CONNEXIONS UTILISATEUR
// ========================================
export const useConnexionsUtilisateur = () => {
  const queryClient = useQueryClient();

  const {
    data: connexions = [],
    isLoading,
    error,
    refetch,
  } = useQuery<UtilisateurPlateforme[], Error>({
    queryKey: ["connexions-utilisateur"],
    queryFn: fetchConnexionsUtilisateur,
    refetchOnWindowFocus: false,
  });

  const deconnexionMutation = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationFn: deconnecterPlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connexions-utilisateur"] });
    },
  });

  const deconnexionTotaleMutation = useMutation<void, Error, void>({
    mutationFn: deconnecterToutesPlateformes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connexions-utilisateur"] });
    },
  });

  return {
    connexions,
    isLoading,
    error,
    refetch,
    deconnecter: deconnexionMutation.mutate,
    deconnecterTout: deconnexionTotaleMutation.mutate,
    isDeconnecting: deconnexionMutation.isPending,
    isDeconnectingAll: deconnexionTotaleMutation.isPending,
  };
};

// ========================================
// HOOK POUR OAUTH
// ========================================
export const useOAuth = () => {
  const queryClient = useQueryClient();

  const initierConnexionMutation = useMutation<
    OAuthInitResponse,
    Error,
    string
  >({
    mutationFn: initierConnexionOAuth,
    onSuccess: (data) => {
      // Rediriger vers l'URL d'authentification
      window.location.href = data.auth_url;
    },
  });

  const connecterPlateforme = (plateformeNom: string) => {
    initierConnexionMutation.mutate(plateformeNom);
  };

  return {
    connecter: connecterPlateforme,
    isConnecting: initierConnexionMutation.isPending,
    error: initierConnexionMutation.error,
  };
};

export const useEstConnecteAMultiplesPlateformes = (
  plateformesNoms: string[]
) => {
  return useQuery<Record<string, boolean>, Error>({
    queryKey: ["est-connecte-multiples", ...plateformesNoms],
    queryFn: async () => {
      const results: Record<string, boolean> = {};
      
      // Vérifier chaque plateforme en parallèle
      await Promise.all(
        plateformesNoms.map(async (nom) => {
          try {
            results[nom] = await estConnecteAPlateforme(nom);
          } catch (error) {
            console.error(`Erreur lors de la vérification pour ${nom}:`, error);
            results[nom] = false;
          }
        })
      );
      
      return results;
    },
    enabled: plateformesNoms.length > 0,
    refetchOnWindowFocus: false,
  });
};
// ========================================
// HOOK POUR VÉRIFIER LES CONNEXIONS
// ========================================
export const useConnexionStatus = (plateformeNom?: string) => {
  const { connexions, isLoading } = useConnexionsUtilisateur();

  const estConnecte = (nom: string) => {
    return connexions.some(
      (connexion) => connexion.plateforme_nom === nom && connexion.actif
    );
  };

  const getConnexion = (nom: string) => {
    return connexions.find(
      (connexion) => connexion.plateforme_nom === nom && connexion.actif
    );
  };

  const connexionsActives = connexions.filter((c) => c.actif);
  const nombreConnexions = connexionsActives.length;

  return {
    connexions: connexionsActives,
    nombreConnexions,
    isLoading,
    estConnecte: plateformeNom ? estConnecte(plateformeNom) : false,
    getConnexion: plateformeNom ? getConnexion(plateformeNom) : undefined,
    estConnecteA: estConnecte,
    obtenirConnexion: getConnexion,
  };
};

// ========================================
// HOOK COMBINÉ POUR LA PAGE DE GESTION DES PLATEFORMES
// ========================================
export const usePlateformeManagement = () => {
  const plateformes = usePlateforme();
  const connexions = useConnexionsUtilisateur();
  const oauth = useOAuth();
  const status = useConnexionStatus();

  // Combine les plateformes avec leur statut de connexion
  const plateformesAvecStatut = plateformes.plateformes.map((plateforme) => ({
    ...plateforme,
    estConnecte: status.estConnecteA(plateforme.nom),
    connexion: status.obtenirConnexion(plateforme.nom),
  }));

  return {
    // Gestion des plateformes (admin)
    plateformes: plateformesAvecStatut,
    isLoadingPlateformes: plateformes.isLoading,
    addPlateforme: plateformes.addPlateforme,
    updatePlateforme: plateformes.updatePlateforme,
    deletePlateforme: plateformes.deletePlateforme,

    // Gestion des connexions utilisateur
    connexions: connexions.connexions,
    isLoadingConnexions: connexions.isLoading,
    deconnecter: connexions.deconnecter,
    deconnecterTout: connexions.deconnecterTout,

    // OAuth
    connecter: oauth.connecter,
    isConnecting: oauth.isConnecting,

    // Statuts
    nombreConnexions: status.nombreConnexions,
    isLoading: plateformes.isLoading || connexions.isLoading,
  };
};

// ========================================
// HOOK POUR LA PAGE UTILISATEUR (CONNEXIONS)
// ========================================
export const useUserPlatformConnections = () => {
  const plateformesDisponibles = usePlateformesDisponibles();
  const connexions = useConnexionsUtilisateur();
  const oauth = useOAuth();

  // Combine les plateformes disponibles avec leur statut de connexion
  const plateformesAvecConnexion = plateformesDisponibles.data?.map((plateforme) => {
    const connexion = connexions.connexions.find(
      (c) => c.plateforme_nom === plateforme.nom && c.actif
    );
    return {
      ...plateforme,
      estConnecte: !!connexion,
      connexion,
    };
  }) || [];

  return {
    plateformes: plateformesAvecConnexion,
    connexions: connexions.connexions,
    isLoading: plateformesDisponibles.isLoading || connexions.isLoading,
    
    // Actions
    connecter: oauth.connecter,
    deconnecter: connexions.deconnecter,
    deconnecterTout: connexions.deconnecterTout,
    
    // États
    isConnecting: oauth.isConnecting,
    isDeconnecting: connexions.isDeconnecting,
    isDeconnectingAll: connexions.isDeconnectingAll,
    
    // Statistiques
    nombreConnexions: connexions.connexions.length,
    nombrePlateformesDisponibles: plateformesDisponibles.data?.length || 0,
  };
};