'use client'
import { useContenu } from '@/hooks/useContenu';
import { useProjetById } from '@/hooks/useProjet';
import { useTemplateById } from '@/hooks/useTemplate';
import { usePublications } from '@/hooks/usePublication';
import { usePlateforme } from '@/hooks/usePlateforme';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PublicationCreate, StatutPublicationEnum } from '@/types/publication';
import { useSearch } from '@/app/context/searchContext';

// Composant Modal de Publication
function PublicationModal({
  isOpen,
  onClose,
  contenuId,
  contenuTitre,
  contenuTexte,
  contenuImageUrl,
  contenuType
}: {
  isOpen: boolean;
  onClose: () => void;
  contenuId: number;
  contenuTitre?: string;
  contenuTexte?: string;
  contenuImageUrl?: string;
  contenuType?: string;
}) {
  const { actions, etatsChargement } = usePublications();
  const { plateformes, isLoading: isLoadingPlateformes } = usePlateforme();
  
  const [formData, setFormData] = useState({
    titre_publication: contenuTitre || '',
    message: contenuTexte || '',
    id_plateforme: '',
    date_programmee: '',
    statut: StatutPublicationEnum.brouillon
  });

  const [publicationImmediate, setPublicationImmediate] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Réinitialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre_publication: contenuTitre || '',
        message: contenuTexte || '',
        id_plateforme: '',
        date_programmee: '',
        statut: StatutPublicationEnum.brouillon
      });
      setPublicationImmediate(false);
      setNotification({ show: false, message: '', type: 'success' });
    }
  }, [isOpen, contenuTitre, contenuTexte]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_plateforme) {
      showNotification('Veuillez sélectionner une plateforme', 'error');
      return;
    }

    try {
      const publicationData: PublicationCreate = {
        id_contenu: contenuId,
        id_plateforme: parseInt(formData.id_plateforme),
        titre_publication: formData.titre_publication,
        message: formData.message,
        statut: publicationImmediate ? StatutPublicationEnum.programme : formData.statut,
        date_programmee: publicationImmediate ? new Date().toISOString() : (formData.date_programmee || undefined),
        meta: {
          image_url: contenuImageUrl,
          contenu_type: contenuType,
          created_from: 'modal'
        }
      };

      const result = await actions.creer(publicationData);
      
      // Si publication immédiate demandée
      if (publicationImmediate && result.id) {
        try {
          await actions.publier(result.id);
          showNotification('Publication créée et publiée avec succès !');
        } catch (publishError) {
          showNotification('Publication créée mais erreur lors de la publication', 'error');
        }
      } else {
        showNotification('Publication créée avec succès !');
      }

      // Fermer la modal après un délai
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      showNotification(`Erreur: ${error.message || 'Échec de la création'}`, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculer la date minimale (maintenant)
  const minDateTime = new Date().toISOString().slice(0, 16);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Publier le contenu
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Contenu #{contenuId} • {contenuType || 'Type inconnu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={etatsChargement.isCreating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mx-6 mt-4 p-3 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plateforme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plateforme *
            </label>
            <select
              name="id_plateforme"
              value={formData.id_plateforme}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isLoadingPlateformes || etatsChargement.isCreating}
            >
              <option value="">Sélectionnez une plateforme</option>
              {plateformes.map(plateforme => (
                <option key={plateforme.id} value={plateforme.id}>
                  {plateforme.plateforme_nom}
                </option>
              ))}
            </select>
            {isLoadingPlateformes && (
              <p className="text-sm text-gray-500 mt-1">Chargement des plateformes...</p>
            )}
          </div>

          {/* Titre de la publication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la publication *
            </label>
            <input
              type="text"
              name="titre_publication"
              value={formData.titre_publication}
              onChange={handleChange}
              required
              placeholder="Donnez un titre à votre publication..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={etatsChargement.isCreating}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Rédigez votre message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              disabled={etatsChargement.isCreating}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500">
                {formData.message.length} caractères
              </p>
              {formData.message.length > 280 && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠️ Message long pour certaines plateformes
                </p>
              )}
            </div>
          </div>

          {/* Aperçu de l'image si disponible */}
          {contenuImageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image incluse
              </label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <img 
                  src={contenuImageUrl} 
                  alt="Aperçu" 
                  className="max-h-32 object-contain mx-auto rounded"
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Cette image sera jointe à la publication
                </p>
              </div>
            </div>
          )}

          {/* Options de publication */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800">Options de publication</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="publication-immediate"
                checked={publicationImmediate}
                onChange={(e) => setPublicationImmediate(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={etatsChargement.isCreating}
              />
              <label htmlFor="publication-immediate" className="ml-2 text-sm text-gray-700">
                Publier immédiatement
              </label>
            </div>

            {!publicationImmediate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programmer la publication
                </label>
                <input
                  type="datetime-local"
                  name="date_programmee"
                  value={formData.date_programmee}
                  onChange={handleChange}
                  min={minDateTime}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={etatsChargement.isCreating}
                />
              </div>
            )}

            {!publicationImmediate && !formData.date_programmee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={etatsChargement.isCreating}
                >
                  <option value={StatutPublicationEnum.brouillon}>Brouillon</option>
                  <option value={StatutPublicationEnum.programme}>Programmé (nécessite une date)</option>
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              disabled={etatsChargement.isCreating}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={etatsChargement.isCreating || !formData.id_plateforme}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center min-w-[140px] justify-center"
            >
              {etatsChargement.isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </>
              ) : publicationImmediate ? (
                'Publier maintenant'
              ) : formData.date_programmee ? (
                'Programmer'
              ) : (
                'Créer brouillon'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant principal de la page Historique
export default function HistoriqueContenuPage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();
  const { searchQuery } = useSearch();
  const [contenuToDelete, setContenuToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Fonction de filtrage des contenus
  const filterContenus = (contenus: Contenu[], query: string) => {
    if (!query.trim()) return contenus;

    const lowerQuery = query.toLowerCase();
    return contenus.filter(contenu =>
      contenu.titre?.toLowerCase().includes(lowerQuery) ||
      contenu.texte?.toLowerCase().includes(lowerQuery) ||
      contenu.type_contenu?.toLowerCase().includes(lowerQuery) ||
      contenu.date_creation?.toLowerCase().includes(lowerQuery) ||
      (contenu.meta && JSON.stringify(contenu.meta).toLowerCase().includes(lowerQuery))
    );
  };

  const filteredContenus = filterContenus(contenus, searchQuery);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const closeNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  const confirmDelete = async () => {
    if (contenuToDelete === null) return;
    
    try {
      await deleteContenu(contenuToDelete);
      showNotification('Contenu supprimé avec succès', 'success');
    } catch (err) {
      showNotification('Erreur lors de la suppression', 'error');
    } finally {
      setContenuToDelete(null);
    }
  };

  const cancelDelete = () => {
    setContenuToDelete(null);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-900">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white min-h-screen">
        <div className="text-red-600 text-center">Une erreur est survenue : {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        } rounded-lg shadow-lg p-4 animate-fade-in`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={closeNotification}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {contenuToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historique des contenus</h1>
            
            {/* Indicateur de recherche active */}
            {searchQuery && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>
                  Recherche: "<strong>{searchQuery}</strong>"
                  ({filteredContenus.length} résultat{filteredContenus.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {filteredContenus.length} contenu{filteredContenus.length > 1 ? 's' : ''}
          </div>
        </div>

        {filteredContenus.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">
              {searchQuery ? "🔍" : "📄"}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "Aucun contenu trouvé" : "Aucun contenu trouvé"}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `Aucun contenu ne correspond à "${searchQuery}". Essayez d'autres termes.`
                : "Créez-en un pour commencer !"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContenus.map(c => (
              <ContenuCard 
                key={c.id} 
                contenu={c} 
                onDelete={() => setContenuToDelete(c.id)}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

// Composant Carte de Contenu avec bouton Publier
function ContenuCard({ contenu, onDelete, searchQuery }: { 
  contenu: Contenu; 
  onDelete: () => void;
  searchQuery: string;
}) {
  const { data: projet } = useProjetById(contenu.id_projet || null);
  const { data: template } = useTemplateById(contenu.id_template || null);
  
  // State pour la modal de publication
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);

  // Composant pour mettre en évidence le texte de recherche
  const HighlightText = ({ text, searchQuery }: { text: string; searchQuery: string }) => {
    if (!searchQuery.trim() || !text) return <>{text}</>;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <Link href={`/contenu/${contenu.id}`} className="cursor-pointer block flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
              {/* Mise en évidence du titre */}
              {searchQuery && contenu.titre ? (
                <HighlightText text={contenu.titre} searchQuery={searchQuery} />
              ) : (
                contenu.titre ?? '(Sans titre)'
              )}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{contenu.id}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-sm text-gray-500">
              {new Date(contenu.date_creation).toLocaleString()} • 
              <span className={`capitalize ml-1 px-2 py-1 rounded text-xs ${
                contenu.type_contenu === 'text' ? 'bg-blue-100 text-blue-800' :
                contenu.type_contenu === 'image' ? 'bg-orange-100 text-orange-800' :
                contenu.type_contenu === 'multimodal' ? 'bg-purple-100 text-purple-800' :
                contenu.type_contenu === 'video' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {contenu.type_contenu}
                {contenu.type_contenu === 'multimodal' && ' 📷'}
              </span>
            </div>

            <div className="flex items-center text-xs text-gray-600">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Projet: <span className="font-medium ml-1">
                {projet?.nom_projet || 'Défaut'}
              </span>
            </div>

            {template && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Template: <span className="font-medium ml-1">
                  {template.nom_template}
                </span>
              </div>
            )}

            {contenu.meta?.has_images && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {contenu.meta.image_count || 1} image(s) utilisée(s)
              </div>
            )}
          </div>
          
          {/* Affichage du contenu avec mise en évidence */}
          {contenu.type_contenu === 'text' && contenu.texte && (
            <p className="text-gray-700 line-clamp-4 text-sm leading-relaxed">
              {searchQuery ? (
                <HighlightText text={contenu.texte} searchQuery={searchQuery} />
              ) : (
                contenu.texte
              )}
            </p>
          )}
          {contenu.type_contenu === 'image' && contenu.image_url && (
            <img 
              src={contenu.image_url} 
              alt={contenu.titre ?? ''} 
              className="mt-2 rounded-lg max-h-48 w-full object-cover hover:opacity-90 transition-opacity border border-gray-200"
            />
          )}
          {contenu.type_contenu === 'multimodal' && contenu.contenu_structure && (
            <div className="mt-2 p-3 bg-gray-50 rounded border">
              <p className="text-sm text-gray-600">
                📄 Contenu multimodal généré
                {contenu.meta?.image_count && ` • ${contenu.meta.image_count} image(s) analysée(s)`}
              </p>
            </div>
          )}
        </div>
      </Link>

      <div className="flex justify-between items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
        <Link
          href={`/contenu/${contenu.id}`}
          className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Détails
        </Link>
        
        <div className="flex space-x-3">
          {/* Bouton Publier */}
          <button
            onClick={() => setIsPublicationModalOpen(true)}
            className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Publier
          </button>

          <Link
            href={`/generer/${contenu.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Éditer
          </Link>
          <button
            className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
            onClick={onDelete}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>

      {/* Modal de publication */}
      <PublicationModal
        isOpen={isPublicationModalOpen}
        onClose={() => setIsPublicationModalOpen(false)}
        contenuId={contenu.id}
        contenuTitre={contenu.titre}
        contenuTexte={contenu.texte || undefined}
        contenuImageUrl={contenu.image_url || undefined}
        contenuType={contenu.type_contenu}
      />
    </div>
  );
}