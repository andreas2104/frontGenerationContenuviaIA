'use client';

import { useProjet } from "@/hooks/useProjet";
import { useState } from "react";
import ProjetInputModal from "./projetInputModal";
import { Projet } from "@/types/projet";

export default function ProjetTableModal() {
  const { projets, isLoading, deleteProjet } = useProjet();
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedProjet(null);
    setShowModal(true);
  }

  const handleEdit = (projet: Projet) => {
    setSelectedProjet(projet);
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      deleteProjet(id);
    }
  }

  console.log(projets);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes Projets</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {projets.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            Aucun projet trouvé. Ajoutez-en un pour commencer !
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nom</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Statut</th>
                  <th className="py-3 px-6 text-left">Date de création</th>
                  <th className="py-3 px-6 text-left">Date de modification</th>
                  <th className="py-3 px-6 text-left">Utilisateur</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {projets.map((projet) => (
                  <tr key={projet.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{projet.nom_projet}</td>
                    <td className="py-3 px-6 text-left">{projet.description}</td>
                    <td className="py-3 px-6 text-left">{projet.status}</td>
                    <td className="py-3 px-6 text-left">{projet.date_creation}</td>
                    <td className="py-3 px-6 text-left">{projet.date_modification}</td>
                    <td className="py-3 px-6 text-left">{projet.id_utilisateur}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(projet)}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(projet.id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <ProjetInputModal
          onClose={() => setShowModal(false)}
          projet={selectedProjet}
        />
      )}
    </div>
  )
}