export enum StatutPublicationEnum {
  brouillon = 'brouillon',
  programme = 'programme',
  publie = 'publie',
  echec = 'echec',
  supprime = 'supprime'
}

export interface Publication {
  id: number;
  id_utilisateur: number;
  id_contenu: number;
  plateforme: string; 
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
  nombre_vues?: number;
  nombre_likes?: number;
  nombre_partages?: number;
  contenu?: {
    texte?: string | null;
    image_url?: string | null;
  };
}

export interface PublicationCreate {
  id_contenu: number;
  message?: string;
  image_url?: string; 
  plateforme: string;  
  titre_publication?: string;  
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

export interface CreatePublicationResponse {
  message: string;
  publication: {
    id: number;
    titre: string;
    statut: string;
    url_publication?: string;
    date_publication?: string;
    date_programmee?: string;
    contenu_publie: string;
    image_utilisee?: string;
  };
}

export interface PublicationStats {
  total: number;
  par_statut: {
    [key: string]: number;
  };
  cette_semaine: number;
  a_venir: number;
  dernieres_publications: Array<{
    id: number;
    titre: string;
    statut: string;
    plateforme: string;
    date_creation: string;
  }>;
  plateforme_populaire: string | null;
}

export interface PublicationListResponse {
  publications: Publication[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface PublicationResume {
  id: number;
  titre: string;
  statut: StatutPublicationEnum;
  plateforme: string;  
  date_creation: string;
}

export interface StatsResponse {
  message?: string;
  stats?: PublicationStats;
  error?: string;
}

