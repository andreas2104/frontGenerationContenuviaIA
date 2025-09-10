'use client';

import { useState } from "react";
import { useContenu } from "@/hooks/useContenu";
import ContenuInputModal from "./contenuInputModal";

export default function ContenuTablePage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();
  const [showModal, setShowModal] = useState(false);
  const [selectedContenu, setSelectedContenu] = useState(null);

  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;



  console.log('data in content page:',contenus)
  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Gestion des Contenus</h1>

      <button
        onClick={() => {
          setSelectedContenu(null);
          setShowModal(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        ➕ Ajouter un Contenu
      </button>

      <ul className="space-y-3">
        {contenus.map((c) => (
          <li key={c.id} className="border p-3 rounded flex justify-between">
            <div>
              <h2 className="font-semibold">{c.titre}</h2>
              <p className="text-sm text-gray-600">Type : {c.type_contenu}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedContenu(c);
                  setShowModal(true);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                ✏ Modifier
              </button>
              <button
                onClick={() => deleteContenu(c.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                🗑 Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <ContenuInputModal
          onClose={() => setShowModal(false)}
          contenu={selectedContenu}
          defaultUserId={1} // ou récupéré depuis auth
        />
      )}
    </div>
  );
}
