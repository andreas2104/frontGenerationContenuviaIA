'use client';

import { useEffect, useState } from "react";
import { useProjet } from "@/hooks/useProjet";
import { Projet } from "@/types/projet";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

type Status = 'draft' | 'active' | 'archived';

interface ProjetInputModalProps {
  onClose: () => void;
  projet: Projet | null;
}

type FormData = {
  nom_projet: string;
  description: string;
  status: Status;
  configuration: string;
};

export default function ProjetInputModal({ onClose, projet }: ProjetInputModalProps) {
  const { addProjet, updateProjet } = useProjet();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  const [formData, setFormData] = useState<FormData>({
    nom_projet: projet?.nom_projet ?? '',
    description: projet?.description ?? '',
    status: (projet?.status as Status) ?? 'draft',
    configuration: projet?.configuration ? JSON.stringify(projet.configuration, null, 2) : '',
  });

  useEffect(() => {
    if (projet) {
      setFormData({
        nom_projet: projet.nom_projet,
        description: projet.description ?? '',
        status: projet.status as Status,
        configuration: projet?.configuration ? JSON.stringify(projet.configuration, null, 2) : '',
      });
    }
  }, [projet]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'status') {
      setFormData((prev) => ({ ...prev, status: value as Status }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utilisateur) {
      alert("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    if (!formData.nom_projet.trim()) {
      alert("Le nom du projet est obligatoire.");
      return;
    }

    let parsedConfig: Record<string, any> | undefined;
    try {
      parsedConfig = formData.configuration ? JSON.parse(formData.configuration) : undefined;
    } catch {
      alert("La configuration doit être un JSON valide.");
      return;
    }

    try {
      if (projet) {
        const canModify = isAdmin || Number(projet.id_utilisateur) === Number(utilisateur.id);
        if (!canModify) {
          alert("Vous n'avez pas la permission de modifier ce projet.");
          return;
        }

        await updateProjet({
          ...projet,
          nom_projet: formData.nom_projet,
          description: formData.description || undefined,
          status: formData.status,
          configuration: parsedConfig,
        });
      } else {
        await addProjet({
          id_utilisateur: Number(utilisateur.id),
          nom_projet: formData.nom_projet,
          description: formData.description || undefined,
          status: formData.status,
          configuration: parsedConfig,
        });
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(error instanceof Error ? error.message : "Erreur lors de la soumission du projet.");
    }
  };

  if (isUserLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg text-black shadow-lg">
          <p className="text-xl font-semibold">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg text-black shadow-lg">
          <p className="text-xl text-red-600">Utilisateur non connecté</p>
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
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] text-black shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {projet ? 'Modifier le Projet' : 'Ajouter un Projet'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du Projet</label>
            <input
              type="text"
              name="nom_projet"
              placeholder="Nom du Projet"
              value={formData.nom_projet}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="active">Actif</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Configuration (JSON)</label>
            <textarea
              name="configuration"
              placeholder="Configuration en JSON"
              value={formData.configuration}
              onChange={handleChange}
              className="border w-full p-2 rounded mt-1 font-mono text-sm h-40 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {projet ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
