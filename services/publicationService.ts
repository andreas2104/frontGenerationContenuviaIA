import { Publication, PublicationCreate, PublicationResponse, PublicationUpdate } from "@/types/publication";
import { apiClient } from "./clientService";



export const fetchAllPublications = async (): Promise<Publication[]> => {
  console.log('Recuperation des publications.');
  return apiClient<Publication[]>('/publications', {
    method: 'GET',
  });
};

export const fetchPublicationById = async (publicationId: number

): Promise<Publication> => {
  console.log(`Recupetation du publication par id: ${publicationId}`);

  return apiClient<Publication>(`/publications/${publicationId}`, {
    method:"GET"
  });
};


export const createPublication = async (
  publicationData:PublicationCreate
): Promise<PublicationResponse> => {
  console.log("creation d'une nouvelle publication");
  return apiClient<PublicationResponse>('/publications', {
    method: 'POST',
    body: JSON.stringify(publicationData),
  });
};


export const updatePublication = async (
  publicationId: number,
  updateData: PublicationUpdate
): Promise<{message: string}> => {
  console.log(`Mise a jours de la publication: ${publicationId}`);
  return apiClient<{ message: string }>(`/publication/${publicationId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};


export const deletePublication = async (publicationId: number): Promise<{ message: string }> => {
  console.log(`Suppression de la publication id: ${publicationId}`); 
    return apiClient<{message: string}>(`/publications/${publicationId}`, {
      method: 'DELETE',
    });  
};

export const publishNow = async (publicationId: number): Promise<{message: string }> => {
  console.log(`Publication immediate Id: ${publicationId}`);
  return apiClient<{ message: string }>(`/publications/${publicationId}/publish`, {
    method: 'POST',
  });
};


export const schedulePublication = async (
  publicationId: number,
  dateProgramme: string,
): Promise<{ message: string }> => {
  console.log(`Programme de la publication id: ${publicationId} pour ${dateProgramme}`)

  return apiClient<{ message: string}>(`/publications/${publicationId}/schedule`, {
    method: 'POST',
    body: JSON.stringify({ date_programme: dateProgramme}),
  });
};

export const cancelPublication = async (publicationId: number): Promise<{ message: string }> => {
  console.log(` Annulation de la publication ID: ${publicationId}`);
  return apiClient<{ message: string }>(`/publications/${publicationId}/cancel`, {
    method: 'POST',
  });
};