'use client';

import { useEffect, useState } from "react";
import { useProjet } from "@/hooks/useProjet";
import { Projet } from "@/types/projet";


type Status = 'draft' | 'active' | 'archived';

interface ProjetInputModalProps {
  onClose: () => void;
  projet: Projet | null;
  defaultUserId?: number;
}

type FormData = {
  nom_projet: string;
  description: string;
  status: Status;
  id_utilisateur: number; 
  configuration: string;
};

export default function ProjetInputModal({ onClose, projet, defaultUserId = 0 }: ProjetInputModalProps) {
  const { addProjet, updateProjet } = useProjet();

  const [formData, setFormData] = useState<FormData>({
    nom_projet: projet?.nom_projet ?? '',
    description: projet?.description ?? '',
    status: (projet?.status as Status) ?? 'draft',
    id_utilisateur: projet?.id_utilisateur ?? defaultUserId, 
    configuration: projet?.configuration ? JSON.stringify(projet.configuration,null, 2) : '',
  });

  useEffect(() => {
    if (projet) {
      setFormData({
        nom_projet: projet.nom_projet,
        description: projet.description ?? '',
        status: projet.status as Status,
        id_utilisateur: projet.id_utilisateur,
        configuration: projet?.configuration ? JSON.stringify(projet.configuration,null, 2) : '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id_utilisateur: prev.id_utilisateur || defaultUserId,
      }));
    }
  }, [projet, defaultUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'id_utilisateur') {
      setFormData((prev) => ({ ...prev, id_utilisateur: parseInt(value || '0', 10) || 0 }));
    } else if (name === 'status') {
      setFormData((prev) => ({ ...prev, status: value as Status }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom_projet.trim()) return alert("Le nom du projet est obligatoire.");
    if (!projet && !formData.id_utilisateur) return alert("id_utilisateur est requis pour la création.");

    let parsedConfig: Record<string, any> | undefined;
    try {
      parsedConfig = formData.configuration ? JSON.parse(formData.configuration) : undefined;
    } catch {
      return alert("La configuration doit être un JSON valide.");
    }

    if (projet) {
      updateProjet({
        ...projet,
        nom_projet: formData.nom_projet,
        description: formData.description || undefined,
        status: formData.status,
        configuration: parsedConfig,
      });
    } else {
      addProjet({
        id_utilisateur: formData.id_utilisateur,
        nom_projet: formData.nom_projet,
        description: formData.description || undefined,
        status: formData.status,
        configuration: parsedConfig,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {projet ? 'Modifier le Projet' : 'Ajouter un Projet'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!projet && (
            <input
              type="number"
              name="id_utilisateur"
              placeholder="ID Utilisateur"
              value={formData.id_utilisateur || ''}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          )}

          <input
            type="text"
            name="nom_projet"
            placeholder="Nom du Projet"
            value={formData.nom_projet}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="archived">Archivé</option>
          </select>

          <textarea
            name="configuration"
            placeholder="Configuration en JSON"
            value={formData.configuration}
            onChange={handleChange}
            className="border w-full p-2 rounded font-mono text-sm h-40"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {projet ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}