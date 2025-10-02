import {
  fetchUserPlateformes,
  fetchUserPlateformeById,
  disconnectUserPlateforme,
  updateUserPlateformeMeta,
  refreshUserPlateformeToken,
  checkTokenValidity,
  redirectToOAuth,
} from "@/services/utilisateurPlateformeService";
import { fetchPlateformesDisponibles } from "@/services/plateformeService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UtilisateurPlateforme, UpdateMetaData } from "@/types/utilisateurPlateforme";

export const useUtilisateurPlateforme = () => {
  const queryClient = useQueryClient();

  //  Liste des connexions utilisateur
  const {
    data: connexions = [],
    isLoading: isLoadingConnexions,
    error: errorConnexions,
  } = useQuery({
    queryKey: ["connexions-utilisateur"],
    queryFn: fetchUserPlateformes,
    refetchOnWindowFocus: false,
  });

  //  Liste des plateformes disponibles
  const {
    data: plateformesDisponibles = [],
    isLoading: isLoadingPlateformes,
    error: errorPlateformes,
  } = useQuery({
    queryKey: ["plateformes-disponibles"],
    queryFn: fetchPlateformesDisponibles,
    refetchOnWindowFocus: false,
  });

  //  Récupération d’une connexion par ID
  const fetchByIdMutation = useMutation({
    mutationFn: (id: number) => fetchUserPlateformeById(id),
  });

  //  Déconnexion d’une plateforme
  const disconnectMutation = useMutation({
    mutationFn: (id: number) => disconnectUserPlateforme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connexions-utilisateur"] });
    },
  });

  //  Mise à jour des métadonnées
  const updateMetaMutation = useMutation({
    mutationFn: (params: { id: number; data: UpdateMetaData }) =>
      updateUserPlateformeMeta(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connexions-utilisateur"] });
    },
  });

  //  Rafraîchissement du token
  const refreshTokenMutation = useMutation({
    mutationFn: (id: number) => refreshUserPlateformeToken(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connexions-utilisateur"] });
    },
  });

  //  Vérification de validité du token
  const checkTokenMutation = useMutation({
    mutationFn: (id: number) => checkTokenValidity(id),
  });

  //  Initialisation OAuth (redirection)
  const initiateOAuthMutation = useMutation({
    mutationFn: (plateformeNom: string) => redirectToOAuth(plateformeNom),
  });

  return {
    connexions,
    plateformesDisponibles,
    isLoading: isLoadingConnexions || isLoadingPlateformes,
    error: errorConnexions || errorPlateformes,

   
    fetchUserPlateformeById: fetchByIdMutation.mutateAsync,
    disconnectUserPlateforme: disconnectMutation.mutate,
    updateUserPlateformeMeta: updateMetaMutation.mutate,
    refreshUserPlateformeToken: refreshTokenMutation.mutate,
    checkTokenValidity: checkTokenMutation.mutate,
    initiateOAuth: initiateOAuthMutation.mutate,
  };
};
