'use client'

import { useUtilisateurs } from "@/hooks/useUtilisateurs";
import { useState } from "react";
import { Utilisateur } from "@/types/utilisateur";

export default function UtilisateurTable() {
  const { utilisateurs, isLoading, updateUtilisateur, deleteUtilisateur } = useUtilisateurs();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [typeCompte, setTypeCompte] = useState<'admin' | 'user' | 'free' | 'premium'>('user');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement des utilisateurs...</div>
      </div>
    );
  }
console.log('data', utilisateurs);
  const handleEditClick = (utilisateur: Utilisateur) => {
    setEditingId(utilisateur.id);
    setTypeCompte(utilisateur.type_compte);
  };

  const handleSaveClick = (id: number) => {
    updateUtilisateur({ id, type_compte: typeCompte });
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteUtilisateur(id);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        </div>

        {utilisateurs.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nom</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Type de Compte</th>
                  <th className="py-3 px-6 text-left">Date de Création</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {utilisateurs.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {u.nom} {u.prenom}
                    </td>
                    <td className="py-3 px-6 text-left">{u.email}</td>
                    <td className="py-3 px-6 text-left">
                      {editingId === u.id ? (
                        <select
                          value={typeCompte}
                          onChange={(e) => setTypeCompte(e.target.value as 'admin' | 'user' | 'free' | 'premium')}
                          className="bg-white border border-gray-300 rounded-md py-1 px-2"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.type_compte === 'admin' ? 'bg-red-200 text-red-800' :
                          u.type_compte === 'premium' ? 'bg-green-200 text-green-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {u.type_compte}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">{new Date(u.date_creation).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {editingId === u.id ? (
                          <>
                            <button
                              onClick={() => handleSaveClick(u.id)}
                              className="text-green-500 hover:text-green-700 font-medium"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="text-gray-500 hover:text-gray-700 font-medium"
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(u)}
                              className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteClick(u.id)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}