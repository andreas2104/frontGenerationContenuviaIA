'use client';

import React, { useState } from 'react';
import { 
  LogIn, 
  LogOut, 
  Loader2, 
  RefreshCw, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Facebook,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Music,
  MessageCircle,
  GamepadIcon,
  Cloud,
  Mail,
  Calendar,
  Trello,
  Slack,
  Figma,
  Youtube,
  Chrome
} from 'lucide-react';
import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
import { useUtilisateurPlateforme } from '@/hooks/useUtilisateurPlateforme';
import { usePlateformesDisponibles } from '@/hooks/usePlateforme';

// 🔹 Fonction utilitaire pour créer un "status" depuis la DB
const buildStatus = (plateformeNom: string, connexions: any[]) => {
  const connection = connexions.find((c) => c.plateforme_nom === plateformeNom);

  if (!connection) {
    return {
      isAvailable: true,
      displayName: plateformeNom,
      isConnected: false,
      tokenValid: false,
      needsReconnection: false,
      canConnect: true,
      connection: null,
      formattedTimeRemaining: 'N/A',
    };
  }

  const expiresAt = connection.token_expires_at ? new Date(connection.token_expires_at) : null;
  const tokenValid = expiresAt ? expiresAt > new Date() : false;
  const timeRemaining = expiresAt ? expiresAt.getTime() - Date.now() : 0;
  
  // Format du temps restant
  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return 'Expiré';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} jour${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return {
    isAvailable: true,
    displayName: plateformeNom,
    isConnected: true,
    tokenValid,
    needsReconnection: !tokenValid,
    canConnect: false,
    connection,
    formattedTimeRemaining: formatTimeRemaining(timeRemaining),
  };
};

// 🔹 Composant pour obtenir l'icône dynamique de la plateforme
const PlateformeIcon = ({ nom, className = "w-6 h-6" }: { nom: string; className?: string }) => {
  const iconConfig: { [key: string]: { icon: React.ComponentType<any>; color: string } } = {
    // Réseaux sociaux
    facebook: { icon: Facebook, color: 'text-blue-600' },
    linkedin: { icon: Linkedin, color: 'text-blue-700' },
    twitter: { icon: Twitter, color: 'text-blue-400' },
    instagram: { icon: Instagram, color: 'text-pink-600' },
    
    // Développement
    github: { icon: Github, color: 'text-gray-900' },
    gitlab: { icon: Github, color: 'text-orange-600' },
    bitbucket: { icon: Github, color: 'text-blue-500' },
    
    // Messagerie & Collaboration
    slack: { icon: Slack, color: 'text-purple-600' },
    discord: { icon: MessageCircle, color: 'text-indigo-600' },
    teams: { icon: MessageCircle, color: 'text-blue-600' },
    zoom: { icon: Video, color: 'text-blue-600' },
    
    // Media & Divertissement
    spotify: { icon: Music, color: 'text-green-600' },
    youtube: { icon: Youtube, color: 'text-red-600' },
    twitch: { icon: GamepadIcon, color: 'text-purple-600' },
    
    // Stockage Cloud
    dropbox: { icon: Cloud, color: 'text-blue-500' },
    onedrive: { icon: Cloud, color: 'text-blue-600' },
    googledrive: { icon: Cloud, color: 'text-green-600' },
    box: { icon: Cloud, color: 'text-blue-700' },
    
    // Productivité
    google: { icon: Chrome, color: 'text-blue-600' },
    notion: { icon: FileText, color: 'text-gray-900' },
    trello: { icon: Trello, color: 'text-blue-500' },
    asana: { icon: Calendar, color: 'text-orange-600' },
    figma: { icon: Figma, color: 'text-purple-600' },
    
    // Email
    gmail: { icon: Mail, color: 'text-red-600' },
    outlook: { icon: Mail, color: 'text-blue-600' },
  };

  // Recherche insensible à la casse et correspondance partielle
  const normalizedNom = nom.toLowerCase();
  const foundKey = Object.keys(iconConfig).find(key => 
    normalizedNom.includes(key) || key.includes(normalizedNom)
  );

  const IconComponent = foundKey ? iconConfig[foundKey].icon : Cloud;
  const colorClass = foundKey ? iconConfig[foundKey].color : 'text-gray-600';

  return <IconComponent className={`${className} ${colorClass}`} />;
};

// Composant Video pour Zoom (à ajouter si nécessaire)
const Video = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

// Composant FileText pour Notion (à ajouter si nécessaire)
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// 🔹 Composant Carte de Plateforme
const PlateformeCard = ({
  plateforme,
  status,
  onConnect,
  onDisconnect,
  onRefresh,
  isConnecting,
  isDisconnecting,
  isRefreshing,
}: {
  plateforme: any;
  status: any;
  onConnect: (plateformeNom: string) => Promise<void>;
  onDisconnect: (userPlateformeId: number, plateformeNom: string) => Promise<void>;
  onRefresh: (userPlateformeId: number) => Promise<void>;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isRefreshing: boolean;
}) => {
  const getStatusColor = () => {
    if (!status.isConnected) return 'text-gray-500';
    if (status.tokenValid) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusText = () => {
    if (!status.isConnected) return 'Non connecté';
    if (status.tokenValid) return `Connecté (${status.formattedTimeRemaining})`;
    return 'Token expiré';
  };

  const getCardBorderColor = () => {
    if (!status.isConnected) return 'border-gray-200';
    if (status.tokenValid) return 'border-green-200';
    return 'border-yellow-200';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-2 ${getCardBorderColor()} hover:shadow-md transition-all duration-300`}>
      <div className="flex justify-between items-center">
        {/* Informations de la plateforme */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border">
            <PlateformeIcon nom={plateforme.nom} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize text-gray-900">
                {plateforme.nom}
              </h3>
              {status.isConnected && status.tokenValid && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {status.isConnected && !status.tokenValid && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-sm ${getStatusColor()}`}>
                {getStatusText()}
              </p>
              {status.isConnected && (
                <div className={`w-2 h-2 rounded-full ${
                  status.tokenValid ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
              )}
            </div>
            {status.isConnected && status.connection && (
              <p className="text-xs text-gray-500 mt-1">
                Connecté le {new Date(status.connection.created_at).toLocaleDateString('fr-FR')}
                {status.connection.external_id && ` • ID: ${status.connection.external_id}`}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {!status.isConnected && (
            <button
              onClick={() => onConnect(plateforme.nom)}
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors shadow-sm"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
              Connecter
            </button>
          )}

          {status.isConnected && (
            <div className="flex items-center space-x-2">
              {status.needsReconnection && (
                <button
                  onClick={() => onRefresh(status.connection.id)}
                  disabled={isRefreshing}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-3 py-2 rounded-md flex items-center gap-2 transition-colors shadow-sm"
                  title="Rafraîchir le token"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Rafraîchir
                </button>
              )}
              <button
                onClick={() => onDisconnect(status.connection.id, plateforme.nom)}
                disabled={isDisconnecting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors shadow-sm"
                title="Se déconnecter"
              >
                {isDisconnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 🔹 Composant Statistiques
const StatsPanel = ({ connexions }: { connexions: any[] }) => {
  const stats = {
    total: connexions.length,
    valides: connexions.filter(c => {
      const expiresAt = c.token_expires_at ? new Date(c.token_expires_at) : null;
      return expiresAt && expiresAt > new Date();
    }).length,
    expirees: connexions.filter(c => {
      const expiresAt = c.token_expires_at ? new Date(c.token_expires_at) : null;
      return !expiresAt || expiresAt <= new Date();
    }).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Total</h3>
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        <p className="text-sm text-gray-500">Connexions</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Valides</h3>
        </div>
        <p className="text-2xl font-bold text-green-600">{stats.valides}</p>
        <p className="text-sm text-gray-500">Actives</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Expirées</h3>
        </div>
        <p className="text-2xl font-bold text-yellow-600">{stats.expirees}</p>
        <p className="text-sm text-gray-500">À rafraîchir</p>
      </div>
    </div>
  );
};

export default function PlateformeConnectPage() {
  const { utilisateur, isLoading: isUserLoading } = useCurrentUtilisateur();
  const {
    connexions,
    plateformesDisponibles,
    isLoading,
    error,
    disconnectUserPlateforme,
    refreshUserPlateformeToken,
    initiateOAuth,
  } = useUtilisateurPlateforme();

  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [refreshingPlatform, setRefreshingPlatform] = useState<number | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<number | null>(null);

  // Gestion de la connexion OAuth
  const handleConnect = async (plateformeNom: string) => {
    try {
      setConnectingPlatform(plateformeNom);
      await initiateOAuth(plateformeNom);
    } catch (error) {
      console.error('Erreur lors de la connexion OAuth:', error);
    } finally {
      setConnectingPlatform(null);
    }
  };

  // Gestion de la déconnexion
  const handleDisconnect = async (userPlateformeId: number, plateformeNom: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir vous déconnecter de ${plateformeNom} ?`)) {
      return;
    }

    try {
      setDisconnectingPlatform(userPlateformeId);
      await disconnectUserPlateforme(userPlateformeId);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setDisconnectingPlatform(null);
    }
  };

  // Gestion du rafraîchissement
  const handleRefresh = async (userPlateformeId: number) => {
    try {
      setRefreshingPlatform(userPlateformeId);
      await refreshUserPlateformeToken(userPlateformeId);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshingPlatform(null);
    }
  };

  // États de chargement
  if (isUserLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div>
            <p className="text-lg font-semibold text-gray-900">Chargement des plateformes</p>
            <p className="text-sm text-gray-600">Veuillez patienter...</p>
          </div>
        </div>
      </div>
    );
  }

  // Vérification utilisateur connecté
  if (!utilisateur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">
            Une erreur est survenue lors du chargement des plateformes.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Plateformes Connectées
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gérez vos connexions aux différentes plateformes et synchronisez vos données en toute sécurité.
          </p>
        </div>

        {/* Statistiques */}
        {connexions.length > 0 && <StatsPanel connexions={connexions} />}

        {/* Liste des plateformes */}
        <div className="space-y-4">
          {plateformesDisponibles.map((plateforme) => {
            const status = buildStatus(plateforme.nom, connexions);
            return (
              <PlateformeCard
                key={plateforme.nom}
                plateforme={plateforme}
                status={status}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onRefresh={handleRefresh}
                isConnecting={connectingPlatform === plateforme.nom}
                isDisconnecting={disconnectingPlatform === status.connection?.id}
                isRefreshing={refreshingPlatform === status.connection?.id}
              />
            );
          })}
        </div>

        {/* Message si aucune plateforme disponible */}
        {plateformesDisponibles.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-sm border max-w-md mx-auto">
              <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune plateforme disponible</h3>
              <p className="text-gray-600 mb-4">
                Aucune plateforme n'est actuellement configurée pour la connexion.
              </p>
              <p className="text-sm text-gray-500">
                Contactez votre administrateur pour ajouter des plateformes.
              </p>
            </div>
          </div>
        )}

        {/* Informations OAuth */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Comment fonctionne la connexion ?</h4>
              <p className="text-blue-700 text-sm">
                En cliquant sur "Connecter", vous serez redirigé vers la plateforme pour autoriser l'accès. 
                Une fois l'autorisation donnée, vous serez automatiquement redirigé vers cette page.
                Vos tokens sont stockés de manière sécurisée et peuvent être rafraîchis automatiquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}