'use client'

import { useModelIA } from "@/hooks/useModelIA";
import { ModelIA } from "@/types/modelIA";
import { useState } from "react";
import ModelIAInputModal from "./modelIAInputModal";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { Settings, Edit3, Trash2, Plus } from "lucide-react";

export default function AdminModelIATable() {
  const { modelIA, isPending, deleteModelIA } = useModelIA();
  const [selectedModelIA, setSelectedModelIA] = useState<ModelIA | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<{id: number, nom: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fermer la notification manuellement
  const closeNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  if (isUserLoading || isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-900">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès réservé aux administrateurs</h2>
          <p className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedModelIA(null);
    setShowModal(true);
  };

  const handleEdit = (model: ModelIA) => {
    setSelectedModelIA(model);
    setShowModal(true);
  };

  const confirmDelete = (model: ModelIA) => {
    setModelToDelete({
      id: model.id,
      nom: model.nom_model
    });
  };

  const executeDelete = async () => {
    if (!modelToDelete) return;

    setIsDeleting(modelToDelete.id);
    
    try {
      await deleteModelIA(modelToDelete.id);
      showNotification(`🗑️ Modèle "${modelToDelete.nom}" supprimé avec succès !`, 'success');
    } catch (error) {
      console.error('Erreur suppression:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression";
      showNotification(`❌ ${errorMessage}`, 'error');
    } finally {
      setIsDeleting(null);
      setModelToDelete(null);
    }
  };

  const cancelDelete = () => {
    setModelToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedModelIA(null);
  };

  const handleModalSuccess = (type: 'add' | 'edit', nomModel: string) => {
    if (type === 'add') {
      showNotification(`✅ Modèle "${nomModel}" créé avec succès !`, 'success');
    } else {
      showNotification(`🔄 Modèle "${nomModel}" modifié avec succès !`, 'success');
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Notification */}
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
      {modelToDelete && (
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
                Êtes-vous sûr de vouloir supprimer le modèle <strong>"{modelToDelete.nom}"</strong> ?
                Cette action est irréversible.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting !== null}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting !== null}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Modèles IA</h1>
            <p className="text-gray-600 mt-2">
              Administration des modèles d'intelligence artificielle
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Ajouter un modèle
          </button>
        </div>

        {/* Liste des modèles IA (sans statistiques) */}
        {modelIA.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun modèle trouvé</h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier modèle IA
            </p>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Ajouter un modèle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelIA.map((m) => {
              const isThisDeleting = isDeleting === m.id;

              return (
                <div
                  key={m.id}
                  className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                    isThisDeleting ? 'opacity-50' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-900">{m.nom_model}</h2>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.actif 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {m.actif ? "Actif" : "Inactif"}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-gray-800">{m.type_model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fournisseur:</span>
                        <span className="font-medium text-gray-800">{m.fournisseur}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coût/token:</span>
                        <span className="font-medium text-gray-800">{m.cout_par_token}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">URL API:</p>
                      <p className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded break-all">
                        {m.api_endpoint}
                      </p>
                    </div>

                    {m.parametres_default && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Configuration:</p>
                        <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(m.parametres_default, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(m)}
                      disabled={isThisDeleting}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => confirmDelete(m)}
                      disabled={isThisDeleting}
                      className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isThisDeleting ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <ModelIAInputModal
          onClose={handleCloseModal}
          modelIA={selectedModelIA}
          onSuccess={handleModalSuccess}
        />
      )}

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