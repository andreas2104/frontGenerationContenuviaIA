 'use client';

import { useEffect, useState } from "react";
import { useTemplate } from "@/hooks/useTemplate";
import { Template } from "@/types/template";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

type TypeSortie = 'text' | 'image' | 'video'; 

interface TemplateInputModalProps {
  onClose: () => void;
  template: Template | null;
  defaultUserId?: number;
}

type FormData = {
  nom_template: string;
  structure: string;
  variables: string;
  type_sortie: TypeSortie;
  public: boolean;
  id_utilisateur: number | null;
};

export default function TemplateInputModal({ onClose, template, defaultUserId = 0 }: TemplateInputModalProps) {
  const { addTemplate, updateTemplate } = useTemplate();
  const {isAdmin, utilisateur} = useCurrentUtilisateur();

  const [formData, setFormData] = useState<FormData>({
    nom_template: template?.nom_template ?? '',
    structure: template?.structure ?? '',
    variables: template?.variables ? JSON.stringify(template.variables, null, 2) : '',
    type_sortie: (template?.type_sortie as TypeSortie) ?? 'text',
    public: template?.public ?? false,
    id_utilisateur: template?.id_utilisateur ?? defaultUserId,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        nom_template: template.nom_template,
        structure: template.structure,
        variables: template.variables ? JSON.stringify(template.variables, null, 2) : '',
        type_sortie: template.type_sortie as TypeSortie,
        public: template.public,
        id_utilisateur: template.id_utilisateur ?? null,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id_utilisateur: defaultUserId,
      }));
    }
  }, [template, defaultUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom_template.trim()) return alert("Le nom du template est obligatoire.");
    if (!formData.structure.trim()) return alert("La structure du template est obligatoire.");

    let parsedVariables: Record<string, any> | undefined;
    try {
      parsedVariables = formData.variables ? JSON.parse(formData.variables) : undefined;
    } catch {
      return alert("Les variables doivent être un JSON valide.");
    }

    const newTemplate = {
      ...formData,
      variables: parsedVariables,
      // id_utilisateur: formData.public ? null : formData.id_utilisateur,
      id_utilisateur: utilisateur?.id ?? null,
    };
    
    if (template) {
      updateTemplate({
        ...template,
        ...newTemplate
      });
    } else {
      addTemplate(newTemplate);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] text-black shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">
          {template ? 'Modifier le Template' : 'Ajouter un Template'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="nom_template"
            placeholder="Nom du Template"
            value={formData.nom_template}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />
          <textarea
            name="structure"
            placeholder="Structure du template (ex: 'Rédige un article sur [sujet]')"
            value={formData.structure}
            onChange={handleChange}
            className="border w-full p-2 rounded h-40"
          />
          <textarea
            name="variables"
            placeholder="Variables en JSON (ex: { \'sujet\': \'IA\' })"
            value={formData.variables}
            onChange={handleChange}
            className="border w-full p-2 rounded font-mono text-sm h-28"
          />
          <select
            name="type_sortie"
            value={formData.type_sortie}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="text">Texte</option>
            <option value="image">Image</option>
            <option value="video">Vidéo</option>
          </select>
          
          {isAdmin && (
            <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="public"
              checked={formData.public}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="public" className="text-sm">Rendre public</label>
          </div>
            )}

          {/* {!formData.public && (
            <input
              type="number"
              name="id_utilisateur"
              placeholder="ID Utilisateur"
              value={formData.id_utilisateur || ''}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              readOnly={!!template}
            />
          )} */}
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
              {template ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}