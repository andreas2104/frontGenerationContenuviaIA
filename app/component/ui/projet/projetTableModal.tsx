'use client';

import { useProjet } from "@/hooks/useProjet";
import { useState } from "react";
import ProjetInputModal from "./projetInputModal";
import { Projet } from "@/types/projet";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

export default function ProjetTableModal() {
  const { projets, isLoading, deleteProjet } = useProjet();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement des projets...</div>
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedProjet(null);
    setShowModal(true);
  };

  const handleEdit = (projet: Projet) => {
    setSelectedProjet(projet);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      try {
        await deleteProjet(id);
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProjet(null);
  };

  const canModifyProjet = (projet: Projet) => {
    const projetUserId = Number(projet.id_utilisateur);
    const currentUserId = Number(utilisateur.id);
    return isAdmin || projetUserId === currentUserId;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isAdmin ? 'Gestion Projets (Admin)' : 'Mes Projets'}
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
          </div>
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {projets.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            {isAdmin
              ? "Aucun projet dans le système."
              : "Aucun projet trouvé. Ajoutez-en un pour commencer !"
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projets.map((projet) => {
              const canModify = canModifyProjet(projet);

              return (
                <div
                  key={projet.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {projet.nom_projet || 'Sans titre'}
                      </h2>
                      {isAdmin && Number(projet.id_utilisateur) !== Number(utilisateur.id) && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                          Autre utilisateur
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-4">{projet.description}</p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Statut:</span> {projet.status}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Créé le:</span> {projet.date_creation}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Modifié le:</span> {projet.date_modification}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full font-medium text-xs">
                      {projet.status === "active" ? "Actif" : projet.status === "archived" ? "Archivé" : "Brouillon"}
                    </div>

                    <div className="flex space-x-2">
                      {canModify ? (
                        <>
                          <button
                            onClick={() => handleEdit(projet)}
                            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(projet.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                          >
                            Supprimer
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Lecture seule</span>
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
        <ProjetInputModal
          onClose={handleCloseModal}
          projet={selectedProjet}
        />
      )}
    </div>
  );
}
