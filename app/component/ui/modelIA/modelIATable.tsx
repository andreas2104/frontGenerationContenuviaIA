'use client'

import { useModelIA } from "@/hooks/useModelIA"
import { ModelIA } from "@/types/modelIA";
import { useState } from "react";
import ModelIAInputModal from "./modelIAInputModal";

export default function ModelIATable() {
  const {modelIA, isPending, deleteModelIA} = useModelIA();
  const [selectedModelIA, setSelectedModelIA] = useState<ModelIA | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement....</div>
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedModelIA(null);
    setShowModal(true);
  }

  const handleEdit = (modelIA: ModelIA) => {
    setSelectedModelIA(modelIA);
    setShowModal(true);
  }
  const handleDelete = async (id:number) => {
    if (confirm("Voulez vous vraiment supprimer ce model??")) {
      deleteModelIA(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedModelIA(null);
  }


  return (
    <div className="p-4 bg-gray-100 min-h-screen">
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-3xl font-bold text-gray-800">Nos Models IA</h1>
        <button 
        onClick={handleAdd}
        className="bg-green-600 text-white  px-6 py-2 font-semibold rounded-md hover:bg-green-700 transition-colors">
          + Ajouter
        </button>
      </div>
      {modelIA.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-12">
          Aucun model trouvé. Ajoutez-en un pour commencer !
        </div>
      ): (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelIA.map((m) => (
            <div
            key={m.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duratio-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{m.nom_model}
                </h2>
                <span>Type_model: {m.type_model}</span>
                <p className="text-gray-600 mb-4 line-clamp-4">Type:   {m.type_model}</p>
                <p className="text-gray-600 mb-4 line-clamp-4">Fournisseur:  {m.fournisseur}</p>
                <p className="text-gray-600 mb-4 line-clamp-4">Url:  {m.api_endpoint}</p>
                <p className="text-gray-500 mb-4 line-clamp-4">Configuration: {m.parametres_default? JSON.stringify(m.parametres_default, null, 2): 'No parametres'}</p>
              </div>
              <div className="flex items-center text-sm  text-gray-500 mb-4">
                <span>Utilisations: {m.cout_par_token}</span>
                {m.parametres_default && (
                  <span className="ml-4 px-3 py-0.5 bg-green-200 text-green-800 rounded-full font-medium text-xs"
                  >Cout/$</span>
                )}
              </div>
              <div className="flex  justify-end space-x-2">
                <button
                onClick={() => handleEdit(m)}
                className="text-blue-500 hover:text-blue-700 font-medium">
                  Modifier
                </button>
                <button
                onClick={() => handleDelete(m.id)}
                className="text-red-500 hover:text-red-700 font-medium">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {showModal && (
      <ModelIAInputModal
      onClose={handleCloseModal}
      modelIA={selectedModelIA}/>
    )}
    </div>
  )

}