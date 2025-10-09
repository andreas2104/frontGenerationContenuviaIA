'use client';

import React, { useState } from 'react';
import {
  History,
  Filter,
  Search,
  Calendar,
  User,
  FileText,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Shield
} from 'lucide-react';
import { useHistorique, useHistoriqueByContenu, useHistoriqueExtended } from '@/hooks/useHistorique';
import { TypeActionEnum } from '@/types/historique';

// 🔹 Composant pour obtenir l'icône d'action
const ActionIcon = ({ type, className = "w-5 h-5" }: { type: string; className?: string }) => {
  const iconConfig: { [key: string]: { icon: React.ComponentType<any>; color: string; bgColor: string } } = {
    [TypeActionEnum.CREATION]: { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50' 
    },
    [TypeActionEnum.MODIFICATION]: { 
      icon: RefreshCw, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
    [TypeActionEnum.SUPPRESSION]: { 
      icon: XCircle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50' 
    },
    [TypeActionEnum.CONSULTATION]: { 
      icon: Eye, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50' 
    },
    [TypeActionEnum.PARTAGE]: { 
      icon: ExternalLink, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50' 
    },
    [TypeActionEnum.AUTRE]: { 
      icon: History, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50' 
    },
  };

  const config = iconConfig[type] || iconConfig[TypeActionEnum.AUTRE];
  const IconComponent = config.icon;

  return (
    <div className={`p-2 rounded-lg ${config.bgColor}`}>
      <IconComponent className={`${className} ${config.color}`} />
    </div>
  );
};

// 🔹 Composant Badge de type d'action
const ActionBadge = ({ type }: { type: string }) => {
  const colorConfig: { [key: string]: { color: string; bgColor: string } } = {
    [TypeActionEnum.CREATION]: { color: 'text-green-800', bgColor: 'bg-green-100' },
    [TypeActionEnum.MODIFICATION]: { color: 'text-blue-800', bgColor: 'bg-blue-100' },
    [TypeActionEnum.SUPPRESSION]: { color: 'text-red-800', bgColor: 'bg-red-100' },
    [TypeActionEnum.CONSULTATION]: { color: 'text-purple-800', bgColor: 'bg-purple-100' },
    [TypeActionEnum.PARTAGE]: { color: 'text-orange-800', bgColor: 'bg-orange-100' },
    [TypeActionEnum.AUTRE]: { color: 'text-gray-800', bgColor: 'bg-gray-100' },
  };

  const config = colorConfig[type] || colorConfig[TypeActionEnum.AUTRE];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${config.bgColor} ${config.color}`}>
      {type}
    </span>
  );
};

// 🔹 Composant Carte d'Historique
const HistoriqueCard = ({ historique }: { historique: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDate(historique.date_action);

  const hasDetails = historique.donnees_avant || historique.donnees_apres;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Informations principales */}
          <div className="flex items-start space-x-4 flex-1">
            <ActionIcon type={historique.type_action} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <ActionBadge type={historique.type_action} />
                <span className="text-sm text-gray-500">{time}</span>
              </div>
              
              <p className="text-gray-900 font-medium mb-1">
                {historique.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Utilisateur #{historique.id_utilisateur}</span>
                </div>
                
                {historique.id_contenu && (
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Contenu #{historique.id_contenu}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {hasDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                title={isExpanded ? "Masquer les détails" : "Afficher les détails"}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Détails expansibles */}
        {isExpanded && hasDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historique.donnees_avant && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-red-600" />
                    Données avant
                  </h4>
                  <pre className="text-xs bg-red-50 p-3 rounded-md overflow-x-auto max-h-40">
                    {JSON.stringify(historique.donnees_avant, null, 2)}
                  </pre>
                </div>
              )}
              
              {historique.donnees_apres && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    Données après
                  </h4>
                  <pre className="text-xs bg-green-50 p-3 rounded-md overflow-x-auto max-h-40">
                    {JSON.stringify(historique.donnees_apres, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Informations supplémentaires */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
              {historique.ip_utilisateur && (
                <div>
                  <span className="font-medium">IP:</span> {historique.ip_utilisateur}
                </div>
              )}
              {historique.user_agent && (
                <div>
                  <span className="font-medium">User Agent:</span>{' '}
                  <span className="truncate">{historique.user_agent}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔹 Composant Filtres
const FiltresPanel = ({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}) => {
  const actionTypes = Object.values(TypeActionEnum);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtres
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <XCircle className="w-4 h-4" />
            Effacer les filtres
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type d'action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'action
          </label>
          <select
            value={filters.typeAction || ''}
            onChange={(e) => onFiltersChange({ ...filters, typeAction: e.target.value || null })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            {actionTypes.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* ID Contenu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Contenu
          </label>
          <input
            type="number"
            value={filters.contenuId || ''}
            onChange={(e) => onFiltersChange({ ...filters, contenuId: e.target.value || null })}
            placeholder="Filtrer par ID contenu"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Date de début */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de début
          </label>
          <input
            type="date"
            value={filters.dateDebut || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateDebut: e.target.value || null })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Date de fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de fin
          </label>
          <input
            type="date"
            value={filters.dateFin || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateFin: e.target.value || null })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// 🔹 Composant Statistiques
const StatsPanel = ({ historiques }: { historiques: any[] }) => {
  const stats = {
    total: historiques.length,
    creations: historiques.filter(h => h.type_action === TypeActionEnum.CREATION).length,
    modifications: historiques.filter(h => h.type_action === TypeActionEnum.MODIFICATION).length,
    suppressions: historiques.filter(h => h.type_action === TypeActionEnum.SUPPRESSION).length,
  };

  const getPercentage = (count: number) => {
    return stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Total</h3>
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        <p className="text-sm text-gray-500">Actions</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Créations</h3>
        </div>
        <p className="text-2xl font-bold text-green-600">{stats.creations}</p>
        <p className="text-sm text-gray-500">{getPercentage(stats.creations)}%</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Modifications</h3>
        </div>
        <p className="text-2xl font-bold text-blue-600">{stats.modifications}</p>
        <p className="text-sm text-gray-500">{getPercentage(stats.modifications)}%</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold">Suppressions</h3>
        </div>
        <p className="text-2xl font-bold text-red-600">{stats.suppressions}</p>
        <p className="text-sm text-gray-500">{getPercentage(stats.suppressions)}%</p>
      </div>
    </div>
  );
};

export default function HistoriquePage() {
  const [filters, setFilters] = useState({
    typeAction: null as string | null,
    contenuId: null as string | null,
    dateDebut: null as string | null,
    dateFin: null as string | null,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const { 
    historiques, 
    isPending, 
    error,
    refetchHistoriques 
  } = useHistorique();

  // Filtrer les historiques
  const filteredHistoriques = historiques.filter(historique => {
    // Filtre par type d'action
    if (filters.typeAction && historique.type_action !== filters.typeAction) {
      return false;
    }

    // Filtre par ID contenu
    if (filters.contenuId && historique.id_contenu !== parseInt(filters.contenuId)) {
      return false;
    }

    // Filtre par date
    if (filters.dateDebut || filters.dateFin) {
      const historiqueDate = new Date(historique.date_action);
      
      if (filters.dateDebut && historiqueDate < new Date(filters.dateDebut)) {
        return false;
      }
      
      if (filters.dateFin) {
        const dateFin = new Date(filters.dateFin);
        dateFin.setHours(23, 59, 59, 999); // Fin de journée
        if (historiqueDate > dateFin) {
          return false;
        }
      }
    }

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        historique.description.toLowerCase().includes(searchLower) ||
        historique.type_action.toLowerCase().includes(searchLower) ||
        historique.id_utilisateur.toString().includes(searchTerm) ||
        (historique.id_contenu && historique.id_contenu.toString().includes(searchTerm))
      );
    }

    return true;
  });

  const handleClearFilters = () => {
    setFilters({
      typeAction: null,
      contenuId: null,
      dateDebut: null,
      dateFin: null,
    });
    setSearchTerm('');
  };

  // États de chargement
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div>
            <p className="text-lg font-semibold text-gray-900">Chargement de l'historique</p>
            <p className="text-sm text-gray-600">Veuillez patienter...</p>
          </div>
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
            Une erreur est survenue lors du chargement de l'historique.
          </p>
          <button 
            onClick={() => refetchHistoriques()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <History className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Historique des Actions
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Consultez l'historique complet des actions effectuées sur la plateforme. 
            Suivez les créations, modifications et suppressions en temps réel.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans l'historique..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => refetchHistoriques()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {historiques.length > 0 && <StatsPanel historiques={historiques} />}

        {/* Filtres */}
        <FiltresPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Résultats */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredHistoriques.length} action{filteredHistoriques.length !== 1 ? 's' : ''} trouvée{filteredHistoriques.length !== 1 ? 's' : ''}
          </h2>
          
          {filteredHistoriques.length > 0 && (
            <button
              onClick={() => {
                // Exporter l'historique (à implémenter)
                console.log('Exporter l\'historique');
              }}
              className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          )}
        </div>

        {/* Liste des historiques */}
        <div className="space-y-4">
          {filteredHistoriques.length > 0 ? (
            filteredHistoriques.map((historique) => (
              <HistoriqueCard key={historique.id} historique={historique} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 shadow-sm border max-w-md mx-auto">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun historique trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {historiques.length === 0 
                    ? "Aucune action n'a encore été enregistrée dans l'historique."
                    : "Aucune action ne correspond à vos critères de recherche."
                  }
                </p>
                {historiques.length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Informations de sécurité */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Sécurité et Confidentialité</h4>
              <p className="text-blue-700 text-sm">
                L'historique des actions est conservé à des fins de traçabilité et de sécurité. 
                Seuls les administrateurs ont accès à l'historique complet. Les utilisateurs 
                standards ne voient que leurs propres actions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}