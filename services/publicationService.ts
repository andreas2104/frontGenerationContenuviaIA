import { Publication, PublicationCreate, CreatePublicationResponse, PublicationStats, PublicationUpdate, StatsResponse } from "@/types/publication";
import { apiClient } from "./clientService";

export const fetchAllPublications = async (): Promise<Publication[]> => {
  console.log('Récupération des publications.');
  const publication = await apiClient<Publication[]>('/publications', {
    method: 'GET',
  });
  return publication.sort((a, b) => b.id - a.id);
};

export const fetchPublicationById = async (publicationId: number): Promise<Publication> => {
  console.log(`Récupération de la publication par id: ${publicationId}`);
  return apiClient<Publication>(`/publications/${publicationId}`, {
    method: "GET"
  });
};

export const createPublication = async (
  publicationData: PublicationCreate
): Promise<CreatePublicationResponse> => {
  console.log("Création d'une nouvelle publication");
  return apiClient<CreatePublicationResponse>('/publications', {
    method: 'POST',
    body: JSON.stringify(publicationData),
  });
};

export const updatePublication = async (
  publicationId: number,
  updateData: PublicationUpdate
): Promise<{ message: string }> => {
  console.log(`Mise à jour de la publication: ${publicationId}`);
  return apiClient<{ message: string }>(`/publications/${publicationId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deletePublication = async (publicationId: number): Promise<{ message: string }> => {
  console.log(`Suppression de la publication id: ${publicationId}`);
  return apiClient<{ message: string }>(`/publications/${publicationId}`, {
    method: 'DELETE',
  });
};

export const fetchPublicationStats = async (): Promise<PublicationStats> => {
  console.log('Récupération des statistiques des publications');
  return apiClient<PublicationStats>('/publications/stats', {
    method: 'GET',
  });
};

export const getPublicationStats = async (): Promise<StatsResponse> => {
  try {
    console.log('Récupération des statistiques des publications');
    const stats = await apiClient<PublicationStats>('/publications/stats', {
      method: 'GET',
    });
    return { stats };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return { error: 'Erreur lors de la récupération des statistiques' };
  }
};


export const publishNow = async (publicationId: number): Promise<{ message: string }> => {
  console.log(`Publication immédiate Id: ${publicationId}`);
  return apiClient<{ message: string }>(`/publications/${publicationId}/publish`, {
    method: 'POST',
  });
};


export const cancelPublication = async (publicationId: number): Promise<{ message: string }> => {
  console.log(`Annulation de la publication ID: ${publicationId}`);
  return apiClient<{ message: string }>(`/publications/${publicationId}/annuler`, {
    method: 'POST',
  });
};


  export const schedulePublication = async (
    publicationId: number,
    dateProgrammee: string,
  ): Promise<{ message: string }> => {
    console.log(`Programmation de la publication id: ${publicationId} pour ${dateProgrammee}`);
    return apiClient<{ message: string }>(`/publications/${publicationId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ date_programmee: dateProgrammee }),
    });
  };

// export const executeScheduledPublications = async (): Promise<{ 
//   message: string; 
//   publications_executees: number;
//   details?: any[];
// }> => {
//   console.log('Exécution des publications programmées');
//   return apiClient<{ 
//     message: string; 
//     publications_executees: number;
//     details?: any[];
//   }>('/publications/execute-scheduled', {
//     method: 'POST',
//   });
// };


