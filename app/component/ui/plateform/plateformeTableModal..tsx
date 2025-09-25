"use client";

import { usePlateforme } from "@/hooks/usePlateforme";
import { PlateformeConfig } from "@/types/plateforme";
import { useState } from "react";
import PlateformeInputModal from "./plateformeInputModal";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

export default function PlateformeTableModal() {
  const { plateformes, isLoading, deletePlateforme } = usePlateforme();
  const [selectedPlateforme, setSelectedPlateforme] = useState<PlateformeConfig | null>(null);
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();
  const [showModal, setShowModal] = useState(false);

  if (isLoading || isUserLoading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  if (!utilisateur) {
    return (
      <div className="text-center mt-10 text-red-600">
        Utilisateur non connecté
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedPlateforme(null);
    setShowModal(true);
  };

  const handleEdit = (plateforme: PlateformeConfig) => {
    setSelectedPlateforme(plateforme);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette plateforme ?")) {
      deletePlateforme(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlateforme(null);
  };

  const canModify = (plateforme: PlateformeConfig) => {
    // Pour l'instant, l'admin peut modifier toutes les plateformes
    return isAdmin;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {Array.isArray(plateformes) && plateformes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            {isAdmin
              ? "Aucune plateforme dans le système."
              : "Aucune plateforme trouvée."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(plateformes) &&
              plateformes.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {p.nom}
                    </h2>
                    <pre className="text-gray-600 mb-4 text-sm">
                      {JSON.stringify(p.config, null, 2)}
                    </pre>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{p.active ? "Active" : "Inactive"}</span>
                    <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</span>
                  </div>

                  {canModify(p) && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {showModal && (
        <PlateformeInputModal
          onClose={handleCloseModal}
          plateforme={selectedPlateforme}
        />
      )}
    </div>
  );
}
