'use client'

import { useTemplate } from "@/hooks/useTemplate";
import { Template } from "@/types/template";
import { useState } from "react";
import TemplateInputModal from "./templateInputModal";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { useSearch } from "@/app/context/searchContext";
import {  Users } from "lucide-react";

export default function TemplateTableModal() {
  const { templates, isPending, deleteTemplate } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();
  const { searchQuery } = useSearch();

  const [showModal, setShowModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{id: number, nom: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
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

  const filterTemplates = (templates: Template[], query: string) => {
    if (!query.trim()) return templates;

    const lowerQuery = query.toLowerCase();
    return templates.filter(template =>
      template.nom_template?.toLowerCase().includes(lowerQuery) ||
      (template.public ? 'public' : 'privé').includes(lowerQuery) ||
      template.date_creation?.toLowerCase().includes(lowerQuery) ||
      template.date_modification?.toLowerCase().includes(lowerQuery) ||
      (typeof template.structure === 'string' && template.structure.toLowerCase().includes(lowerQuery)) ||

      (typeof template.structure === 'object' && JSON.stringify(template.structure).toLowerCase().includes(lowerQuery))
    );
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-900">Chargement de votre profil...</div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <p className="text-xl text-red-600 font-semibold mb-4">Utilisateur non connecté</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-900">Chargement des templates...</div>
      </div>
    );
  }

  // Filtrer les templates selon les droits ET la recherche
  const filteredByRights = isAdmin 
    ? templates 
    : templates.filter(t => {
      const isOwner = Number(t.id_utilisateur) === Number(utilisateur.id);
      const isPublicTemplate = t.public === true;
      return isOwner || isPublicTemplate;
      // Number(t.id_utilisateur) === Number(utilisateur.id)
    });

  const filteredTemplates = filterTemplates(filteredByRights, searchQuery);

  const handleAdd = () => {
    setSelectedTemplate(null);
    setShowModal(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const confirmDelete = (template: Template) => {
    setTemplateToDelete({
      id: template.id,
      nom: template.nom_template || 'ce template'
    });
  };

  const executeDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(templateToDelete.id);
    
    try {
      await deleteTemplate(templateToDelete.id);
      showNotification(`🗑️ Template "${templateToDelete.nom}" supprimé avec succès !`, 'success');
    } catch (error) {
      console.error('Erreur suppression:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression";
      showNotification(`❌ ${errorMessage}`, 'error');
    } finally {
      setIsDeleting(null);
      setTemplateToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTemplateToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const handleModalSuccess = (type: 'add' | 'edit', nomTemplate: string) => {
    if (type === 'add') {
      showNotification(`✅ Template "${nomTemplate}" créé avec succès !`, 'success');
    } else {
      showNotification(`🔄 Template "${nomTemplate}" modifié avec succès !`, 'success');
    }
  };

  const canModifyTemplate = (template: Template) => {
    const templateUserId = Number(template.id_utilisateur);
    const currentUserId = Number(utilisateur.id);
    const isOwner = templateUserId === currentUserId;
    return isAdmin || isOwner;
  };

  // Statistiques basées sur les templates filtrés
  const publicTemplates = filteredTemplates.filter(t => t.public).length;
  const privateTemplates = filteredTemplates.filter(t => !t.public).length;

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

  // Fonction pour formater l'affichage de la structure
  const renderStructure = (structure: any, searchQuery: string) => {
    if (!structure) return "Aucune structure définie";
    
    if (typeof structure === 'string') {
      return searchQuery ? (
        <HighlightText text={structure} searchQuery={searchQuery} />
      ) : (
        structure
      );
    }
    
    if (Array.isArray(structure)) {
      return (
        <div className="space-y-1">
          {structure.map((item, idx) => (
            <div key={idx} className="text-xs bg-gray-50 p-1 rounded">
              {typeof item === 'object' ? 
                (searchQuery ? 
                  <HighlightText text={JSON.stringify(item)} searchQuery={searchQuery} /> 
                  : JSON.stringify(item)
                ) 
                : (searchQuery ? 
                  <HighlightText text={String(item)} searchQuery={searchQuery} /> 
                  : String(item)
                )
              }
            </div>
          ))}
        </div>
      );
    }
    
    // Si c'est un objet
    const structureString = JSON.stringify(structure, null, 2);
    return searchQuery ? (
      <HighlightText text={structureString} searchQuery={searchQuery} />
    ) : (
      <pre className="text-xs whitespace-pre-wrap">{structureString}</pre>
    );
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
      {templateToDelete && (
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
                Êtes-vous sûr de vouloir supprimer le template <strong>`{templateToDelete.nom}`</strong> ?
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
        {/* Header avec indicateur de recherche */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Gestion Templates (Admin)' : 'Mes Templates'}
            </h1>
            {/* <p className="text-gray-600 mt-2">
              Connecté en tant que: <span className="font-semibold text-gray-800">{utilisateur.prenom} {utilisateur.nom}</span>
              {isAdmin && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
            </p> */}
            
            {/* Indicateur de recherche active */}
            {searchQuery && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>
                  Recherche: `<strong>{searchQuery}</strong>`
                  ({filteredTemplates.length} résultat{filteredTemplates.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajouter Template</span>
          </button>
        </div>

        {/* Statistiques basées sur les templates filtrés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{filteredTemplates.length}</div>
            <div className="text-gray-600">Total templates</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{publicTemplates}</div>
            <div className="text-gray-600">Templates publics</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{privateTemplates}</div>
            <div className="text-gray-600">Templates privés</div>
          </div>
        </div>

        {/* Liste des templates avec recherche */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              {searchQuery ? "🔍" : "📄"}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery 
                ? "Aucun template trouvé" 
                : isAdmin ? "Aucun template dans le système" : "Aucun template trouvé"
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `Aucun template ne correspond à "${searchQuery}". Essayez d'autres termes.`
                : isAdmin 
                  ? "Les templates créés par les utilisateurs apparaîtront ici."
                  : "Commencez par créer votre premier template !"
              }
            </p>
            {!searchQuery && (
              <button 
                onClick={handleAdd}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Créer votre premier template
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((t) => {
              const canModify = canModifyTemplate(t);
              const isThisDeleting = isDeleting === t.id;

              return (
                <div
                  key={t.id}
                  className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                    isThisDeleting ? 'opacity-50' : ''
                  }`}
                >
                  <div>              
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {searchQuery && t.nom_template ? (
                          <HighlightText text={t.nom_template} searchQuery={searchQuery} />
                        ) : (
                          t.nom_template || 'Sans titre'
                        )}
                      </h2>
                      {/* Badges pour identifier le propriétaire */}
                      <div className="flex gap-1">
                        {isAdmin && Number(t.id_utilisateur) !== Number(utilisateur.id) && (
                          <span className="text-xs  text-yellow-800 mb-3  px-3 py-2 rounded-full font-medium">
                           
                          <Users/>
                          </span>
                        )}
                        {!isAdmin && Number(t.id_utilisateur) !== Number(utilisateur.id) && t.public && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                            Template partagé
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-gray-600 mb-4 line-clamp-4 text-sm leading-relaxed max-h-32 overflow-y-auto">
                      {renderStructure(t.structure, searchQuery)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.public 
                        ? "bg-green-100 text-green-800" 
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {t.public ? "Public" : "Privé"}
                    </div>
                    
                    <div className="flex space-x-3">
                      {canModify ? (
                        <>
                          <button
                            onClick={() => handleEdit(t)}
                            disabled={isThisDeleting}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={() => confirmDelete(t)}
                            disabled={isThisDeleting}
                            className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {isThisDeleting ? 'Suppression...' : 'Supprimer'}
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Lecture seule
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <TemplateInputModal
          onClose={handleCloseModal}
          template={selectedTemplate}
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