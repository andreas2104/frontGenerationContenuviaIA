'use client';

import { useProjet } from "@/hooks/useProjet";
import { useState } from "react";
import ProjetInputModal from "./projetInputModal";
import { Projet } from "@/types/projet";


export default function ProjetTableModal() {
  const { projets, isLoading, deleteProjet } = useProjet();
  const [selectedProjet, setSelectedProjet] = useState<Projet | null >(null);
  const [showModal, setShowModal] = useState(false);  
  if (isLoading) return <div> Chargement...</div>;
  
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
    <div className="p-4">
      <button 
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        + Ajouter
      </button>
      <table className="w-full mt-4 border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-50 text-blue-400">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date Creation</th>
            <th className="border p-2">Date Modification</th>
            <th className="border p-2">Utilisateur</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projets.map((projet) => (
            <tr className="hover:bg-gray-100 text-blue-400" 
            key={projet.id}>
              <td className="border p-2">{projet.nom_projet}</td>
              <td className="border p-2">{projet.description}</td>
               <td className="border p-2">{projet.status}</td>
               <td className="border p-2">{projet.date_creation}</td>
               <td className="border p-2">{projet.date_modification}</td>
               <td className="border p-2">{projet.id_utilisateur}</td>
                
              <td className="border p-2 space-x-2">
                <button 
                  onClick={() => handleEdit(projet)}
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(projet.id)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <ProjetInputModal
          onClose={() => setShowModal(false)}
          projet={selectedProjet}
        />
      )}
    </div>
  )
}