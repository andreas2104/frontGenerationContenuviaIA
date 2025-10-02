import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllPublications,
  fetchPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  publishNow,
  schedulePublication,
  cancelPublication,
} from '@/services/publicationService';
import {
  Publication,
  PublicationCreate,
  PublicationUpdate,
  StatutPublicationEnum,
} from '@/types/publication';
import React from "react";



export const usePublications = () => {
  const queryClient = useQueryClient();
  const {
    data: publications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchAllPublications,
    refetchOnWindowFocus: false,
    select: (data) => data, 
  });

  const { publicationsFiltrees, statistiques, prochainesPublications } = React.useMemo(() => {
    const maintenant = new Date();
    
    const brouillons = publications.filter(p => p.statut === StatutPublicationEnum.brouillon);
    const programmees = publications.filter(p => p.statut === StatutPublicationEnum.programme);
    const publiees = publications.filter(p => p.statut === StatutPublicationEnum.publie);
    const enErreur = publications.filter(p => p.statut === StatutPublicationEnum.erreur);
    
    const prochaines = programmees.filter(p => {
      if (!p.date_programmee) return false;
      const datePub = new Date(p.date_programmee);
      const diffJours = (datePub.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24);
      return diffJours >= 0 && diffJours <= 7;
    }).sort((a, b) => 
      new Date(a.date_programmee!).getTime() - new Date(b.date_programmee!).getTime()
    );

    return {
      publicationsFiltrees: {
        brouillons,
        programmees,
        publiees,
        enErreur,
        toutes: publications,
      },
      statistiques: {
        total: publications.length,
        brouillons: brouillons.length,
        programmees: programmees.length,
        publiees: publiees.length,
        enErreur: enErreur.length,
        prochaines: prochaines.length,
      },
      prochainesPublications: prochaines,
    };
  }, [publications]);

  const mutations = {
    creation: useMutation({
      mutationFn: createPublication,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publications'] });
        queryClient.invalidateQueries({ queryKey: ['contenus'] });
      },
    }),

    modification: useMutation({
      mutationFn: ({ id, data }: { id: number; data: PublicationUpdate }) =>
        updatePublication(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publications'] });
      },
    }),

    suppression: useMutation({
      mutationFn: deletePublication,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publications'] });
      },
    }),

    publication: useMutation({
      mutationFn: publishNow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publications'] });
      },
    }),

    programmation: useMutation({
      mutationFn: ({ id, date }: { id: number; date: string }) =>
        schedulePublication(id, date),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publications'] });
      },
    }),

    annulation: useMutation({
      mutationFn: cancelPublication,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publications'] });
      },
    }),
  };

  const actions = {
    creer: async (data: PublicationCreate) => {
      try {
        return await mutations.creation.mutateAsync(data);
      } catch (error) {
        throw new Error(`Échec de la création: ${error}`);
      }
    },

    modifier: async (id: number, data: PublicationUpdate) => {
      try {
        return await mutations.modification.mutateAsync({ id, data });
      } catch (error) {
        throw new Error(`Échec de la modification: ${error}`);
      }
    },

    supprimer: async (id: number) => {
      try {
        return await mutations.suppression.mutateAsync(id);
      } catch (error) {
        throw new Error(`Échec de la suppression: ${error}`);
      }
    },

    publier: async (id: number) => {
      try {
        return await mutations.publication.mutateAsync(id);
      } catch (error) {
        throw new Error(`Échec de la publication: ${error}`);
      }
    },

    programmer: async (id: number, date: string) => {
      try {
        return await mutations.programmation.mutateAsync({ id, date });
      } catch (error) {
        throw new Error(`Échec de la programmation: ${error}`);
      }
    },

    annuler: async (id: number) => {
      try {
        return await mutations.annulation.mutateAsync(id);
      } catch (error) {
        throw new Error(`Échec de l'annulation: ${error}`);
      }
    },
  };

  const etatsChargement = {
    isCreating: mutations.creation.isPending,
    isUpdating: mutations.modification.isPending,
    isDeleting: mutations.suppression.isPending,
    isPublishing: mutations.publication.isPending,
    isScheduling: mutations.programmation.isPending,
    isCanceling: mutations.annulation.isPending,
    isLoadingGlobal: isLoading,
    isMutating: Object.values(mutations).some(mutation => mutation.isPending),
  };

  return {
    publications,
    publicationsFiltrees,
    statistiques,
    prochainesPublications,
    isLoading,
    error,
    etatsChargement,
    actions,
    refetch,
  };
};



export const usePublication = (publicationId: number | null) => {
  return useQuery({
    queryKey: ['publication', publicationId],
    queryFn: () => fetchPublicationById(publicationId!),
    enabled: !!publicationId,
    refetchOnWindowFocus: false,
  });
};

export const usePublicationStats = () => {
  const { publications, isLoading } = usePublications();

  const stats = React.useMemo(() => ({
    total: publications.length,
    parStatut: {
      [StatutPublicationEnum.brouillon]: publications.filter(p => p.statut === StatutPublicationEnum.brouillon).length,
      [StatutPublicationEnum.programme]: publications.filter(p => p.statut === StatutPublicationEnum.programme).length,
      [StatutPublicationEnum.publie]: publications.filter(p => p.statut === StatutPublicationEnum.publie).length,
      [StatutPublicationEnum.erreur]: publications.filter(p => p.statut === StatutPublicationEnum.erreur).length,
    },
    parPlateforme: publications.reduce((acc, pub) => {
      acc[pub.id_plateforme] = (acc[pub.id_plateforme] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    
 
    tauxReussite: publications.length > 0 
      ? Math.round((publications.filter(p => p.statut === StatutPublicationEnum.publie).length / publications.length) * 100)
      : 0,
    
    publicationsCetteSemaine: publications.filter(p => {
      const datePub = new Date(p.date_creation);
      const maintenant = new Date();
      const diffJours = (maintenant.getTime() - datePub.getTime()) / (1000 * 60 * 60 * 24);
      return diffJours <= 7;
    }).length,
  }), [publications]);

  return {
    stats,
    isLoading,
  };
};


export const usePublicationCalendar = () => {
  const { publications } = usePublications();

  const evenementsCalendrier = React.useMemo(() => 
    publications
      .filter(p => p.date_programmee)
      .map(publication => ({
        id: publication.id,
        title: publication.titre_publication,
        start: new Date(publication.date_programmee!),
        end: new Date(new Date(publication.date_programmee!).getTime() + 30 * 60 * 1000), 
        statut: publication.statut,
        plateforme: publication.id_plateforme,
      }))
  , [publications]);

  return { evenementsCalendrier };
};


export const usePublicationsAttention = () => {
  const { publications } = usePublications();

  const publicationsAttention = React.useMemo(() => ({
    enErreur: publications.filter(p => p.statut === StatutPublicationEnum.erreur),
    brouillonsAnciens: publications.filter(p => {
      if (p.statut !== StatutPublicationEnum.brouillon) return false;
      const dateCreation = new Date(p.date_creation);
      const maintenant = new Date();
      const diffJours = (maintenant.getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24);
      return diffJours > 7; 
    }),
    programmationsImminentes: publications.filter(p => {
      if (p.statut !== StatutPublicationEnum.programme || !p.date_programmee) return false;
      const dateProgrammee = new Date(p.date_programmee);
      const maintenant = new Date();
      const diffHeures = (dateProgrammee.getTime() - maintenant.getTime()) / (1000 * 60 * 60);
      return diffHeures <= 24; 
    }),
  }), [publications]);

  return { publicationsAttention };
};