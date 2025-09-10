'use client';

import { useEffect, useState } from "react";
import { useContenu } from "@/hooks/useContenu";
import { Contenu } from "@/types/contenu";


type TypeContenu = 'text' | 'video' | 'image';

interface ContenuInputModalProps {
  onClose: () => void;
  contenu: Contenu | null;
  defaultUserId?: number;
}

type FormData = {
  titre: string;
  type_contenu: TypeContenu;
  texte: string;
  image_url: string;
  meta: string;
  id_utilisateur: number;
  id_model: number;
  id_template: number | null;
  id_prompt: number | null;
};

export default function ContenuInputModal({ onClose, contenu, defaultUserId = 0 }: ContenuInputModalProps) {
  const { addContenu, updateContenu } = useContenu();

  const [formData, setFormData] = useState<FormData>({
    titre: contenu?.titre ?? '',
    type_contenu: (contenu?.type_contenu as TypeContenu) ?? 'text',
    texte: contenu?.texte ?? '',
    image_url: contenu?.image_url ?? '',
    meta: contenu?.meta ? JSON.stringify(contenu.meta, null, 2) : '',
    id_utilisateur: contenu?.id_utilisateur ?? defaultUserId,
    id_model: contenu?.id_model ?? 0,
    id_template: contenu?.id_template ?? null,
    id_prompt: contenu?.id_prompt ?? null,
  });

  useEffect(() => {
    if (contenu) {
      setFormData({
        titre: contenu.titre ?? '',
        type_contenu: contenu.type_contenu as TypeContenu,
        texte: contenu.texte ?? '',
        image_url: contenu.image_url ?? '',
        meta: contenu.meta ? JSON.stringify(contenu.meta, null, 2) : '',
        id_utilisateur: contenu.id_utilisateur,
        id_model: contenu.id_model,
        id_template: contenu.id_template ?? null,
        id_prompt: contenu.id_prompt ?? null,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id_utilisateur: prev.id_utilisateur || defaultUserId,
      }));
    }
  }, [contenu, defaultUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_utilisateur) return alert("L'ID de l'utilisateur est obligatoire.");
    if (!formData.id_model) return alert("L'ID du modèle est obligatoire.");
    if (!formData.titre.trim()) return alert("Le titre du contenu est obligatoire.");

    let parsedMeta: Record<string, any> | undefined;
    try {
      parsedMeta = formData.meta ? JSON.parse(formData.meta) : undefined;
    } catch {
      return alert("Les métadonnées doivent être un JSON valide.");
    }

    const newContenu = {
      ...formData,
      texte: formData.type_contenu === 'text' ? formData.texte : null,
      image_url: formData.type_contenu === 'image' ? formData.image_url : null,
      meta: parsedMeta,
    };

    if (contenu) {
      updateContenu({
        ...contenu,
        ...newContenu
      });
    } else {
      addContenu(newContenu);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] text-black shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">
          {contenu ? 'Modifier le Contenu' : 'Ajouter un Contenu'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            name="id_utilisateur"
            placeholder="ID Utilisateur"
            value={formData.id_utilisateur || ''}
            onChange={handleNumberChange}
            className="border w-full p-2 rounded"
            readOnly={!!contenu} 
          />

          <input
            type="number"
            name="id_model"
            placeholder="ID du Modèle IA"
            value={formData.id_model || ''}
            onChange={handleNumberChange}
            className="border w-full p-2 rounded"
          />

          <input
            type="number"
            name="id_template"
            placeholder="ID du Template (optionnel)"
            value={formData.id_template || ''}
            onChange={handleNumberChange}
            className="border w-full p-2 rounded"
          />

          <input
            type="number"
            name="id_prompt"
            placeholder="ID du Prompt (optionnel)"
            value={formData.id_prompt || ''}
            onChange={handleNumberChange}
            className="border w-full p-2 rounded"
          />

          <input
            type="text"
            name="titre"
            placeholder="Titre du Contenu"
            value={formData.titre}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />

          <select
            name="type_contenu"
            value={formData.type_contenu}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="text">Texte</option>
            <option value="image">Image</option>
            <option value="video">Vidéo</option>
          </select>

          {formData.type_contenu === 'text' && (
            <textarea
              name="texte"
              placeholder="Contenu Texte"
              value={formData.texte}
              onChange={handleChange}
              className="border w-full p-2 rounded h-40"
            />
          )}

          {formData.type_contenu === 'image' && (
            <input
              type="text"
              name="image_url"
              placeholder="URL de l'Image"
              value={formData.image_url}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          )}

          <textarea
            name="meta"
            placeholder="Métadonnées en JSON (optionnel)"
            value={formData.meta}
            onChange={handleChange}
            className="border w-full p-2 rounded font-mono text-sm h-28"
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
              {contenu ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}