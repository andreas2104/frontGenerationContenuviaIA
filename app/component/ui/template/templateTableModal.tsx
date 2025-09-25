'use client'

import { useTemplate } from "@/hooks/useTemplate";
import { Template } from "@/types/template";
import { useState } from "react";
import TemplateInputModal from "./templateInputModal";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

export default function TemplateTableModal() {
  const { templates, isPending, deleteTemplate } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();
  const [showModal, setShowModal] = useState(false);

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement de votre profil...</div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">
          Utilisateur non connecté
          <div className="mt-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Aller à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement des templates...</div>
      </div>
    );
  }

  console.log(' Templates chargés:', templates.length);
  console.log(' Utilisateur actuel:', utilisateur.email, 'Admin:', isAdmin);
  console.log(' ID utilisateur:', utilisateur.id, typeof utilisateur.id);

  const handleAdd = () => {
    setSelectedTemplate(null);
    setShowModal(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce template ?")) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  // Fonction améliorée avec plus de debugging et vérifications de type
  const canModifyTemplate = (template: Template) => {
    console.log('🔍 Debugging template permissions:');
    console.log('  - Template ID:', template.id);
    console.log('  - Template id_utilisateur:', template.id_utilisateur, typeof template.id_utilisateur);
    console.log('  - Current user ID:', utilisateur.id, typeof utilisateur.id);
    console.log('  - isAdmin:', isAdmin);
    
    // Vérification stricte avec conversion de type si nécessaire
    const templateUserId = Number(template.id_utilisateur);
    const currentUserId = Number(utilisateur.id);
    
    console.log('  - After conversion - Template User ID:', templateUserId);
    console.log('  - After conversion - Current User ID:', currentUserId);
    
    const isOwner = templateUserId === currentUserId;
    const canModify = isAdmin || isOwner;
    
    console.log('  - Is Owner:', isOwner);
    console.log('  - Can Modify:', canModify);
    console.log('  ---');
    
    return canModify;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        {/* Header unique avec informations utilisateur */}
        <div className="flex justify-between items-center mb-6">
          {/* <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isAdmin ? 'Gestion Templates (Admin)' : 'Mes Templates'}
            </h1>
            <p className="text-gray-600 mt-1">
              Connecté en tant que: <span className="font-semibold">{utilisateur.prenom} {utilisateur.nom}</span>
              <span className="ml-2 text-sm text-gray-500">(ID: {utilisateur.id})</span>
              {isAdmin && (
                <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
            </p>
          </div> */}
          <div className="flex space-x-3">
            <button 
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              + Ajouter
            </button>
            {/* <button 
              onClick={logout}
              className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors"
            >
              Déconnexion
            </button> */}
          </div>
        </div>

        {templates.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            {isAdmin
              ? "Aucun template dans le système."
              : "Aucun template trouvé. Ajoutez-en un pour commencer !"
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t) => {
              const canModify = canModifyTemplate(t);
              
              return (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {t.nom_template || 'Sans titre'}
                      </h2>
                      {/* Indicateurs de propriétaire */}
                      <div className="flex flex-col items-end space-y-1">
                        {isAdmin && Number(t.id_utilisateur) !== Number(utilisateur.id) && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                            Autre utilisateur
                          </span>
                        )}
                        {/* Debug info - à retirer en production */}
                        <span className="text-xs text-gray-400">
                          Owner ID: {t.id_utilisateur}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-4">
                      {t.structure && typeof t.structure === 'object'
                        ? Array.isArray(t.structure)
                          ? t.structure.map((item, idx) => (
                              <div key={idx}>
                                {typeof item === 'object' ? JSON.stringify(item) : item}
                              </div>
                            ))
                          : JSON.stringify(t.structure, null, 2)
                        : t.structure}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {t.public ? (
                        <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-medium text-xs">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full font-medium text-xs">
                          Privé
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {canModify ? (
                        <>
                          <button
                            onClick={() => handleEdit(t)}
                            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                          >
                            Supprimer
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-gray-400 text-sm">Lecture seule</span>
                          {/* Debug info - à retirer en production */}
                          <span className="text-xs text-red-400">
                            Debug: {Number(t.id_utilisateur) === Number(utilisateur.id) ? 'Owner match' : 'No match'}
                          </span>
                        </div>
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
        />
      )}
    </div>
  );
}