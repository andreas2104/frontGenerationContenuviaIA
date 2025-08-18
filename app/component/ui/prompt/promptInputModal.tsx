'use client'

import { usePrompt } from "@/hooks/usePrompt";
import { Prompt } from "@/types/prompt";
import { useEffect, useState } from "react";


type FormData = {
  id_utilisateur: number;
  nom_prompt: string;
  texte_prompt: string;
  utilisation_count: number;
  parametres?: string ;
  public: boolean;
}

export default function PrompInputModal({onClose, prompt}: {onClose: () => void, prompt: Prompt | null}){
  const { addPrompt, updatePrompt} = usePrompt();

  const [formData, setFormData] = useState<FormData>({
    id_utilisateur: prompt?.id_utilisateur ?? 1, 
    nom_prompt: prompt?.nom_prompt ?? '',
    texte_prompt: prompt?.texte_prompt ?? '',
    utilisation_count: prompt?.utilisation_count ?? 0,
    parametres: prompt?.parametres ? JSON.stringify(prompt.parametres, null, 2) : '', 
    public: prompt?.public ?? false,
  });

  useEffect(() => {
    if(prompt) {
      setFormData({
        id_utilisateur: prompt?.id_utilisateur ?? 1,
        nom_prompt: prompt?.nom_prompt ?? '',
        texte_prompt: prompt?.texte_prompt ?? '',
        utilisation_count: prompt?.utilisation_count ?? 0,
        parametres: prompt?.parametres ? JSON.stringify(prompt.parametres, null, 2) : '',
        public: prompt?.public ?? false,
      });
    }
  }, [prompt]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const promptData: Prompt = {
        id: prompt?.id ?? Date.now(),
        id_utilisateur: formData.id_utilisateur,
        nom_prompt: formData.nom_prompt,
        texte_prompt: formData.texte_prompt,
        utilisation_count: formData.utilisation_count,
        public: formData.public,
        date_creation: prompt?.date_creation ?? new Date().toISOString(),
        date_modification: new Date().toISOString(),
        parametres: formData.parametres ? JSON.parse(formData.parametres) : null,
      };

      if (prompt) {
        updatePrompt(promptData);
      } else {
        addPrompt(promptData);
      }
      alert("data add succes");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      alert("Veuillez vérifier les paramètres JSON.");
    }
  };
console.log(formData);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl text-black  mb-4">{prompt ? 'Modifier le prompt' : 'Ajouter un prompt'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Nom du prompt</label>
            <input
              type="text"
              name="nom_prompt"
              value={formData.nom_prompt}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md  text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Texte du prompt</label>
            <textarea
              name="texte_prompt"
              value={formData.texte_prompt}
              onChange={handleChange}
              rows={5}
              className="mt-1 p-2 w-full border rounded-md  text-black"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-black">Paramètres (JSON)</label>
            <textarea
              name="parametres"
              value={formData.parametres}
              onChange={handleChange}
              rows={5}
              className="mt-1 p-2 w-full border rounded-md  text-black"
            ></textarea>
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-black mr-2">Public</label>
            <input
              type="checkbox"
              name="public"
              checked={formData.public}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {prompt ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}