
'use client'

import { useTemplate } from "@/hooks/useTemplate";
import { Template } from "@/types/template";
import { useState } from "react";
import TemplateInputModal from "./templateInput";

export default function TemplateTableModal() {
  const { templates, isPending, deleteTemplate } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  console.log('data', templates);

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
      await deleteTemplate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes Templates</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            Aucun template trouvé. Ajoutez-en un pour commencer !
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {t.nom_template || 'Sans titre'}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    {typeof t.structure === 'string'
                      ? t.structure
                      : JSON.stringify(t.structure, null, 2)}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    Type de sortie: {t.type_sortie || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {t.public && (
                    <span className="ml-4 px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-medium text-xs">
                      Public
                    </span>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
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
        <TemplateInputModal
          onClose={handleCloseModal}
          template={selectedTemplate}
        />
      )}
    </div>
  );
}
