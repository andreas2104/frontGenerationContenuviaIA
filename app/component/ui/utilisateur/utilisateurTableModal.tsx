'use client';

import { useUtilisateurs, useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { useState } from "react";
import { Utilisateur } from "@/types/utilisateur";
import UtilisateurInputModal from "./utilisateurInputModal";

export default function UtilisateurTableModal() {
  const { utilisateurs, isLoading, updateUtilisateur, deleteUtilisateur } = useUtilisateurs();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isUserLoading) return <div>Chargement de votre profil...</div>;
  if (!utilisateur) return (
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
  if (isLoading) return <div>Chargement des utilisateurs...</div>;


  const displayedUsers = isAdmin ? utilisateurs : [utilisateur];

  const handleEdit = (u: Utilisateur) => {
    setSelectedUser(u);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteUtilisateur(id);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleSaveUser = (data: Partial<Utilisateur>) => {
    if (data.id) {
      updateUtilisateur(data);
    }
    handleCloseModal();
  };

  const canModifyUser = (u: Utilisateur) => {
    return isAdmin || u.id === utilisateur.id;
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isAdmin ? "Gestion des Utilisateurs" : "Mon Profil"}
          </h1>
          {isAdmin && (
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              + Ajouter Utilisateur
            </button>
          )}
        </div>

        {displayedUsers.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            {isAdmin ? "Aucun utilisateur trouvé." : "Aucun profil disponible."}
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
                   <th className="py-3 px-6 text-left">Photo</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {displayedUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{u.nom} {u.prenom}</td>
                    <td className="py-3 px-6">{u.email}</td>
                      <td className="py-3 px-6">{u.photo}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.type_compte === "admin"
                          ? "bg-red-200 text-red-800"
                          : u.type_compte === "premium"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}>
                        {u.type_compte}
                      </span>
                    </td>
                    <td className="py-3 px-6">{new Date(u.date_creation).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        {canModifyUser(u) ? (
                          <>
                            <button
                              onClick={() => handleEdit(u)}
                              className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                              Modifier
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="text-red-500 hover:text-red-700 font-medium"
                              >
                                Supprimer
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Lecture seule</span>
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

      {showModal && (
        <UtilisateurInputModal
          utilisateur={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}