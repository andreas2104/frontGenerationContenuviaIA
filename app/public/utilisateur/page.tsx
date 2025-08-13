'use client';

import { useState, FormEvent } from 'react';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';
import { Utilisateur } from '@/types/utilisateur';

// État initial d'un utilisateur pour le formulaire
const initialUserState: Utilisateur = {
  id: 0,
  nom: '',
  prenom: '',
  email: '',
  password: '',
  role: 'utilisateur',
};

export default function UtilisateurPage() {
  const { utilisateurs, isLoading, error, addMutation, updateMutation, deleteMutation } = useUtilisateurs();

  const [formState, setFormState] = useState<Utilisateur>(initialUserState);
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour gérer la soumission du formulaire (ajout ou modification)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formState);
      setIsEditing(false);
    } else {
      addMutation.mutate(formState);
    }
    setFormState(initialUserState);
  };

  // Fonction pour charger un utilisateur dans le formulaire pour la modification
  const handleEditClick = (utilisateur: Utilisateur) => {
    setFormState(utilisateur);
    setIsEditing(true);
  };

  // Fonction pour gérer la suppression d'un utilisateur
  const handleDeleteClick = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteMutation.mutate(id);
    }
  };

  // Gestion des états globaux de la page
  if (isLoading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Erreur: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion des utilisateurs</h1>

      {/* Formulaire d'ajout/modification */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={formState.nom}
              onChange={(e) => setFormState({ ...formState, nom: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              value={formState.prenom}
              onChange={(e) => setFormState({ ...formState, prenom: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          {!isEditing && (
            <input
              type="password"
              placeholder="Mot de passe"
              value={formState.password}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          )}
          <select
            value={formState.role}
            onChange={(e) => setFormState({ ...formState, role: e.target.value as 'admin' | 'utilisateur' })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setFormState(initialUserState);
                setIsEditing(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des utilisateurs */}
      <h2 className="text-2xl font-semibold mb-4">Liste des utilisateurs</h2>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {utilisateurs.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {utilisateurs.map((utilisateur) => (
                <tr key={utilisateur.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{utilisateur.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{utilisateur.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{utilisateur.prenom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{utilisateur.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utilisateur.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {utilisateur.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditClick(utilisateur)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteClick(utilisateur.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-center text-gray-500">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
}
