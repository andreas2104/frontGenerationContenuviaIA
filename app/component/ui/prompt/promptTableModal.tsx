'use client'

import { usePrompt } from "@/hooks/usePrompt";
import { Prompt } from "@/types/prompt";
import { useState } from "react";
import PromptInputModal from "./promptInputModal"; // Assurez-vous que le chemin est correct

export default function PromptTableModal() {
  const { prompt, isPending, deletePrompt } = usePrompt();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedPrompt(null);
    setShowModal(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce prompt ?")) {
      deletePrompt(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrompt(null); 
    };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes Prompts</h1>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {prompt.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            Aucun prompt trouvé. Ajoutez-en un pour commencer !
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompt.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {p.nom_prompt}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    {p.texte_prompt}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>Utilisations: {p.utilisation_count}</span>
                  {p.public && (
                    <span className="ml-4 px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-medium text-xs">Public</span>
                  )}
                </div>
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
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PromptInputModal
          onClose={handleCloseModal}
          prompt={selectedPrompt}
        />
      )}
    </div>
  );
}