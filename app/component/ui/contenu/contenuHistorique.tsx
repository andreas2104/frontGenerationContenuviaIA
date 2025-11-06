'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useContenu } from '@/hooks/useContenu';
import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
import { usePublications } from '@/hooks/usePublication';
import { useSearch } from '@/app/context/searchContext';
import { ContenuCard } from './contenuCard';

export default function HistoriqueContenuPage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();
  const { utilisateur } = useCurrentUtilisateur();
  const { searchQuery } = useSearch();
  const { publications, statistiques } = usePublications();
  const [contenuToDelete, setContenuToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const userContenus = contenus.filter(contenu => {
    return contenu.id_utilisateur === utilisateur?.id;
  });

  // Compter les publications par contenu
  const getPublicationCountForContenu = (contenuId: number) => {
    return publications.filter(pub => pub.id_contenu === contenuId).length;
  };

  // Obtenir les publications récentes pour un contenu
  const getRecentPublicationsForContenu = (contenuId: number) => {
    return publications
      .filter(pub => pub.id_contenu === contenuId)
      .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
      .slice(0, 3);
  };

  const filterContenus = (contenus: any[], query: string) => {
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

  const filteredContenus = filterContenus(userContenus, searchQuery);

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
            
            <div className="mt-2 flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">
                Vos contenus personnels - Confidentialité totale
              </span>
            </div>

            {searchQuery && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>
                  Recherche: `<strong>{searchQuery}</strong>`
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
              {searchQuery ? "Aucun contenu trouvé" : "Aucun contenu personnel"}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `Aucun de vos contenus ne correspond à "${searchQuery}". Essayez d'autres termes.`
                : "Vous n'avez pas encore créé de contenu. Créez-en un pour commencer !"
              }
            </p>
            {!searchQuery && (
              <Link
                href="/generer"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Créer votre premier contenu
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContenus.map((c: any) => (
              <ContenuCard 
                key={c.id} 
                contenu={c} 
                onDelete={() => setContenuToDelete(c.id)}
                searchQuery={searchQuery}
                publicationCount={getPublicationCountForContenu(c.id)}
                recentPublications={getRecentPublicationsForContenu(c.id)}
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