export enum StatutPublicationEnum {
  brouillon = 'brouillon',
  programme = 'programme',
  publie = 'publie',
  erreur = 'erreur',
  annule = 'annule'
}

export interface Publication {
  id: number;
  id_utilisateur: number;
  id_contenu: number;
  id_plateforme: number;
  titre_publication: string;
  statut: StatutPublicationEnum;
  date_creation: string;
  date_modification: string | null;
  date_programmee: string | null;
  date_publication: string | null;
  url_publication: string | null;
  id_externe: string | null;
  message_erreur: string | null;
  parametres_publication: Record<string, any>;
}

export interface PublicationCreate {
  id_contenu: number;
  id_plateforme: number;
  titre_publication: string;
  statut?: StatutPublicationEnum;
  date_programmee?: string | null;
  parametres_publication?: Record<string, any>;
}

export interface PublicationUpdate {
  titre_publication?: string;
  statut?: StatutPublicationEnum;
  date_programmee?: string | null;
  parametres_publication?: Record<string, any>;
  url_publication?: string | null;
  id_externe?: string | null;
  message_erreur?: string | null;
}

export interface PublicationResponse {
  message: string;
  publication?: Publication;
}

export interface PublicationListResponse {
  publications: Publication[];
  total?: number;
  page?: number;
  limit?: number;
}