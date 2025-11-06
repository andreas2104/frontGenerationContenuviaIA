'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  usePublications,
  usePublicationStats,
  usePublicationsAttention,
} from '@/hooks/usePublication'; 
import { Loader2, Plus, AlertTriangle, Clock, BarChart, Eye, Heart, Share2, ExternalLink, Pencil, Trash2, Send, XCircle, CheckCircle, X } from 'lucide-react';
import { StatutPublicationEnum, Publication } from '@/types/publication';
import PublicationInputModal from './publicationInputModal';
import PublicationStatView from './publicationStatView';
import { cancelPublication } from '@/services/publicationService';
import Image from 'next/image';

interface SimpleCardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerIcon?: React.ReactNode;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ title, children, className = '', headerIcon }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {title && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
            {headerIcon}
            <span>{title}</span>
        </h3>
      </div>
    )}
    {children}
  </div>
);

interface SimpleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({ onClick, children, className = '', disabled, isLoading }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${className} ${
      (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
    }`}
  >
    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
  </button>
);

const SimpleBadge: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold leading-4 rounded-full ${className}`}>
    {children}
  </span>
);

// Composant de notification
interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertTriangle className="h-5 w-5 text-red-600" />,
    info: <BarChart className="h-5 w-5 text-blue-600" />,
    warning: <Clock className="h-5 w-5 text-yellow-600" />,
  };

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 shadow-lg ${colors[type]} animate-slide-in`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Container de notifications
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const NotificationContainer: React.FC<{ notifications: NotificationItem[]; onClose: (id: string) => void }> = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Modal de confirmation
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${colors[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PublicationDashboard() {
  const router = useRouter();
  const {
    publications,
    publicationsFiltrees,
    statistiques,
    prochainesPublications,
    etatsChargement,
    actions,
    refetch,
    isLoading,
    error,
  } = usePublications();
  const { stats } = usePublicationStats();
  const { publicationsAttention } = usePublicationsAttention();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  // Fonction pour ajouter une notification
  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  // Fonction pour fermer une notification
  const closeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Fonction pour afficher le modal de confirmation
  const showConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: 'danger' | 'warning' | 'info' = 'danger'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
      type
    });
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    showConfirmModal(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cette publication ? Cette action est irréversible.',
      async () => {
        try {
          await actions.supprimer(id);
          addNotification('success', '✅ Publication supprimée avec succès.');
        } catch (e) {
          console.error('Erreur suppression:', e);
          addNotification('error', '❌ Erreur lors de la suppression.');
        }
      },
      'danger'
    );
  };

  const handlePublishNow = async (pub: Publication) => {
    showConfirmModal(
      'Publier maintenant',
      'Voulez-vous publier cette publication immédiatement ?',
      async () => {
        try {
          await actions.modifier(pub.id, {
            statut: StatutPublicationEnum.publie 
          });
          addNotification('success', '✅ Publication lancée avec succès.');
        } catch (e) {
          console.error('Erreur publication:', e);
          addNotification('error', '❌ Erreur lors de la publication.');
        }
      },
      'info'
    );
  };

  const handleSchedule = async (pub: Publication, dateProgrammee: string) => {
    try {
      await actions.modifier(pub.id, {
        statut: StatutPublicationEnum.programme,
        date_programmee: dateProgrammee
      });
      addNotification('success', '✅ Publication programmée avec succès.');
    } catch (e) {
      console.error('Erreur programmation:', e);
      addNotification('error', '❌ Erreur lors de la programmation.');
    }
  };

  const handleCancel = async (id: number) => {
    showConfirmModal(
      'Annuler la programmation',
      'Voulez-vous annuler cette publication programmée ?',
      async () => {
        try {
          await cancelPublication(id);
          await refetch();
          addNotification('success', '✅ Publication annulée avec succès.');
        } catch (e) {
          console.error('Erreur annulation:', e);
          addNotification('error', '❌ Erreur lors de l\'annulation.');
        }
      },
      'warning'
    );
  };

  const getStatusBadge = (statut: StatutPublicationEnum) => {
    let color = 'bg-gray-200 text-gray-800';
    let text = 'Inconnu';

    switch (statut) {
      case StatutPublicationEnum.brouillon:
        color = 'bg-blue-100 text-blue-800';
        text = 'Brouillon';
        break;
      case StatutPublicationEnum.programme:
        color = 'bg-yellow-100 text-yellow-800';
        text = 'Programmé';
        break;
      case StatutPublicationEnum.publie:
        color = 'bg-green-100 text-green-800';
        text = 'Publié';
        break;
      case StatutPublicationEnum.supprime:
        color = 'bg-red-100 text-red-800';
        text = 'Annulée';
        break;
      case StatutPublicationEnum.echec:
        color = 'bg-red-100 text-red-800';
        text = 'Erreur';
        break;
    }

    return <SimpleBadge className={color}>{text}</SimpleBadge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || etatsChargement.isLoadingGlobal) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-600" />
        <span className="text-xl font-semibold text-gray-700">
          Chargement des publications...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 rounded-lg m-8">
        <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
        <p>
          Impossible de récupérer les données :{' '}
          {error instanceof Error ? error.message : 'Erreur inconnue'}
        </p>
        <SimpleButton 
            onClick={() => refetch()} 
            className="mt-4 bg-red-600 text-white"
        >
          Réessayer
        </SimpleButton>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Container de notifications */}
      <NotificationContainer notifications={notifications} onClose={closeNotification} />

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        type={confirmModal.type}
      />

      <div className="max-w-7xl mx-auto">
        
        {/* En-tête du Tableau de Bord */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Tableau de Bord des Publications
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez toutes vos publications sur X (Twitter)
            </p>
          </div>
            <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle Publication</span>
        </button>
        </div>

        {/* Aperçu des Statistiques - Utilisation du composant séparé */}
        <PublicationStatView statistiques={statistiques} />

        {/* Attention & Programmation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Bloc d'Attention */}
          <SimpleCard
            className="lg:col-span-2"
            title="Publications Nécessitant Attention"
            headerIcon={<AlertTriangle className="h-5 w-5 text-red-700" />}
          >
            <ul className="space-y-3">
                <li className="text-gray-700">
                  <span className="font-bold text-red-600">
                    {publicationsAttention.enEchec.length} Erreur(s) :
                  </span>{' '}
                  à vérifier immédiatement.
                </li>
                <li className="text-gray-700">
                  <span className="font-bold text-orange-600">
                    {publicationsAttention.programmationsImminentes.length}{' '}
                    Programmation(s) Imminente(s) :
                  </span>{' '}
                  prévues dans les 24h.
                </li>
                <li className="text-gray-700">
                  <span className="font-bold text-amber-600">
                    {publicationsAttention.brouillonsAnciens.length} Brouillon(s) Ancien(s) :
                  </span>{' '}
                  non modifiés depuis plus de 7 jours.
                </li>
              </ul>
          </SimpleCard>

          {/* Bloc Prochaines Programmations */}
          <SimpleCard
            title="Prochaines Programmations (7 Jours)"
            headerIcon={<Clock className="h-5 w-5 text-gray-700" />}
          >
            {prochainesPublications.length === 0 ? (
              <p className="text-gray-500 italic">
                Aucune publication programmée pour la semaine prochaine.
              </p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {prochainesPublications.slice(0, 5).map((pub) => (
                  <li key={pub.id} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
                    <p className="font-medium truncate">{pub.titre_publication || 'Sans titre'}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(pub.date_programmee!)}
                    </p>
                  </li>
                ))}
                {prochainesPublications.length > 5 && (
                  <li className="text-sm text-center text-gray-500 pt-2">
                    ...et {prochainesPublications.length - 5} autres
                  </li>
                )}
              </ul>
            )}
          </SimpleCard>
        </div>

        {/* Liste Complète des Publications */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publication
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Contenu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Métriques
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <BarChart className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-semibold text-lg mb-2">Aucune publication</p>
                        <p className="text-gray-400 text-sm mb-4">Créez votre première publication pour commencer</p>
                        <button
                          onClick={handleCreateNew}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Créer une publication</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  publications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* Colonne Publication */}
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                         
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {/* {pub.titre_publication || `Publication #${pub.id}`} */}
                              </span>
                              {pub.url_publication && (
                                <a 
                                  href={pub.url_publication} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Voir sur X"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                                {pub.plateforme.toUpperCase()}
                              </span>
                            </div>
                            {pub.message_erreur && (
                              <p className="text-xs text-red-600 mt-1 truncate">
                                 {pub.message_erreur}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Colonne Contenu */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {pub.parametres_publication?.message || pub.contenu?.texte || 'Aucun message'}
                          </p>
                          {(pub.parametres_publication?.image_url || pub.contenu?.image_url) && (
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              <img
                              src = {pub.parametres_publication?.image_url || pub.contenu?.image_url}
                              />
                               {/* {(pub.parametres_publication?.image_url || pub.contenu?.image_url) && (
                            <Image
                            width={300}
                            height={300} 
                              src={pub.parametres_publication?.image_url || pub.contenu?.image_url} 
                              alt="Miniature"
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                          )} */}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Colonne Statut */}
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex flex-col space-y-1">
                          {getStatusBadge(pub.statut)}
                          {pub.date_programmee && (
                            <span className="text-xs text-gray-500">
                              {formatDate(pub.date_programmee)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Colonne Dates */}
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>
                            <span className="font-medium">Création:</span>{' '}
                            {formatDate(pub.date_creation)}
                          </div>
                          {pub.date_publication && (
                            <div>
                              <span className="font-medium">Publication:</span>{' '}
                              {formatDate(pub.date_publication)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Colonne Métriques */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>{pub.nombre_vues || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Heart className="h-4 w-4" />
                            <span>{pub.nombre_likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Share2 className="h-4 w-4" />
                            <span>{pub.nombre_partages || 0}</span>
                          </div>
                        </div>
                      </td>

                      {/* Colonne Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {pub.statut === StatutPublicationEnum.brouillon && (
                            <button
                              onClick={() => handlePublishNow(pub)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Publier maintenant"
                              disabled={etatsChargement.isMutating}
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          
                          {pub.statut === StatutPublicationEnum.programme && (
                            <>
                              <button
                                onClick={() => {
                                  const newDate = prompt('Nouvelle date (YYYY-MM-DDTHH:MM:SS):', pub.date_programmee || '');
                                  if (newDate) {
                                    handleSchedule(pub, newDate);
                                  }
                                }}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Reprogrammer"
                                disabled={etatsChargement.isMutating}
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleCancel(pub.id)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Annuler la programmation"
                                disabled={etatsChargement.isMutating}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {pub.statut === StatutPublicationEnum.supprime && (
                            <>
                              <button
                                onClick={() => handlePublishNow(pub)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Publier maintenant"
                                disabled={etatsChargement.isMutating}
                              >
                                <Send className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const newDate = prompt('Nouvelle date de programmation (YYYY-MM-DDTHH:MM:SS):');
                                  if (newDate) {
                                    handleSchedule(pub, newDate);
                                  }
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Reprogrammer"
                                disabled={etatsChargement.isMutating}
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleDelete(pub.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                            disabled={etatsChargement.isMutating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
         <PublicationInputModal
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}