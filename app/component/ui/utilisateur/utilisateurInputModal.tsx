'use client';

import { useState, useEffect } from "react";
import { Utilisateur } from "@/types/utilisateur";

interface UtilisateurInputModalProps {
  utilisateur?: Utilisateur | null;
  onClose: () => void;
  onSave: (data: Partial<Utilisateur>) => void;
}

export default function UtilisateurInputModal({ utilisateur, onClose, onSave }: UtilisateurInputModalProps) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [typeCompte, setTypeCompte] = useState<"admin" | "user" | "free" | "premium">("user");

  useEffect(() => {
    if (utilisateur) {
      setPrenom(utilisateur.prenom);
      setNom(utilisateur.nom);
      setEmail(utilisateur.email);
      setTypeCompte(utilisateur.type_compte);
    }
  }, [utilisateur]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: utilisateur?.id, prenom, nom, email, type_compte: typeCompte });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {utilisateur ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type de compte</label>
            <select
              value={typeCompte}
              onChange={(e) => setTypeCompte(e.target.value as "admin" | "user" | "free" | "premium")}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
