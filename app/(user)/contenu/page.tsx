'use client'
import { useContenu } from '@/hooks/useContenu';
import { useProjetById } from '@/hooks/useProjet';
import { useTemplateById } from '@/hooks/useTemplate'; // ✅ AJOUT
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HistoriqueContenuPage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();
  const [contenuToDelete, setContenuToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

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
          <h1 className="text-3xl font-bold text-gray-900">Historique des contenus</h1>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {contenus.length} contenu{contenus.length > 1 ? 's' : ''}
          </div>
        </div>

        {contenus.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Aucun contenu trouvé. Créez-en un pour commencer !
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contenus.map(c => (
              <ContenuCard 
                key={c.id} 
                contenu={c} 
                onDelete={() => setContenuToDelete(c.id)}
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

// ✅ NOUVEAU : Composant séparé pour chaque carte de contenu
function ContenuCard({ contenu, onDelete }: { 
  contenu: Contenu; 
  onDelete: () => void;
}) {
  // ✅ AJOUT : Récupération du projet
  const { data: projet } = useProjetById(contenu.id_projet || null);
  
  // ✅ AJOUT : Récupération du template (si existant)
  const { data: template } = useTemplateById(contenu.id_template || null);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <Link href={`/contenu/${contenu.id}`} className="cursor-pointer block flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
              {contenu.titre ?? '(Sans titre)'}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{contenu.id}
            </span>
          </div>
          
          {/* ✅ MODIFICATION : Informations enrichies */}
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

            {/* ✅ NOUVEAU : Projet */}
            <div className="flex items-center text-xs text-gray-600">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Projet: <span className="font-medium ml-1">
                {projet?.nom_projet || 'Défaut'}
              </span>
            </div>

            {/* ✅ NOUVEAU : Template */}
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

            {/* ✅ NOUVEAU : Images utilisées (pour multimodal) */}
            {contenu.meta?.has_images && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {contenu.meta.image_count || 1} image(s) utilisée(s)
              </div>
            )}
          </div>
          
          {/* Affichage du contenu */}
          {contenu.type_contenu === 'text' && contenu.texte && (
            <p className="text-gray-700 line-clamp-4 text-sm leading-relaxed">{contenu.texte}</p>
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
    </div>
  );
}