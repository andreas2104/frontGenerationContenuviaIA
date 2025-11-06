'use client'

import { usePrompt } from "@/hooks/usePrompt";
import { fetchPrompt } from "@/services/promptService";
import { Prompt } from "@/types/prompt";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

type FormData = {
  id_utilisateur: number;
  nom_prompt: string;
  texte_prompt: string;
  utilisation_count: number;
  parametres?: string;
  public: boolean;
}

interface PrompInputModalProps {
  onClose: () => void;
  prompt: Prompt | null;
  onSuccess?: (type: 'add' | 'edit', nomPrompt: string) => void;
}

export default function PrompInputModal({ onClose, prompt, onSuccess }: PrompInputModalProps) {
  const { addPrompt, updatePrompt } = usePrompt();

  // Template JSON par défaut pour les paramètres
  const defaultJsonTemplate = `{
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1.0,
  "model": "gpt-4",
  "system_message": "Vous êtes un assistant utile"
}`;

  const [formData, setFormData] = useState<FormData>({
    id_utilisateur: prompt?.id_utilisateur ?? 1, 
    nom_prompt: prompt?.nom_prompt ?? '',
    texte_prompt: prompt?.texte_prompt ?? '',
    utilisation_count: prompt?.utilisation_count ?? 0,
    parametres: prompt?.parametres ? JSON.stringify(prompt.parametres, null, 2) : defaultJsonTemplate, 
    public: prompt?.public ?? false,
  });

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prompt) {
      setFormData({
        id_utilisateur: prompt.id_utilisateur,
        nom_prompt: prompt.nom_prompt,
        texte_prompt: prompt.texte_prompt,
        utilisation_count: prompt.utilisation_count,
        parametres: prompt.parametres ? JSON.stringify(prompt.parametres, null, 2) : defaultJsonTemplate,
        public: prompt.public,
      });
    }
  }, [prompt]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'parametres') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validation JSON en temps réel
      try {
        if (value.trim()) {
          JSON.parse(value);
          setJsonError(null);
        } else {
          setJsonError(null);
        }
      } catch {
        setJsonError("JSON invalide ");
      }
    } else if (type === 'checkbox') {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation finale du JSON
    if (formData.parametres && formData.parametres.trim()) {
      try {
        JSON.parse(formData.parametres);
      } catch (error) {
        toast.error("Veuillez corriger le format JSON des paramètres.");
        setIsSubmitting(false);
        return;
      }
    }

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
        parametres: formData.parametres && formData.parametres.trim() ? JSON.parse(formData.parametres) : null,
      };

      if (prompt) {
        updatePrompt(promptData);
        toast.success("Prompt modifié avec succès !");
        if (onSuccess) onSuccess('edit', formData.nom_prompt);
      } else {
        addPrompt(promptData);
        toast.success(" Prompt ajouté avec succès !");
        if (onSuccess) onSuccess('add', formData.nom_prompt);
      }
      
      await fetchPrompt();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error(" Erreur lors de la soumission du formulaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {prompt ? 'Modifier le Prompt' : 'Ajouter un Prompt'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Grid pour les champs principaux */}
          <div className="grid grid-cols-1 gap-6">
            {/* Nom du prompt */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nom du prompt
              </label>
              <input
                type="text"
                name="nom_prompt"
                value={formData.nom_prompt}
                onChange={handleChange}
                placeholder="ex: Assistant créatif, Analyse de texte, Génération d'idées"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Texte du prompt */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Texte du prompt
              </label>
              <textarea
                name="texte_prompt"
                value={formData.texte_prompt}
                onChange={handleChange}
                placeholder="Écrivez votre prompt ici. Soyez précis et détaillé pour de meilleurs résultats..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 resize-y"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Paramètres JSON */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-medium">
                  Paramètres (JSON)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    parametres: defaultJsonTemplate
                  }))}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Réinitialiser le template
                </button>
              </div>
              <textarea
                name="parametres"
                value={formData.parametres}
                onChange={handleChange}
                rows={6}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm resize-y text-gray-900 placeholder-gray-500 ${
                  jsonError ? 'border-red-500' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-60' : ''}`}
                placeholder="Paramètres de configuration au format JSON"
                disabled={isSubmitting}
              />
              {jsonError && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {jsonError}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                Paramètres communs : temperature, max_tokens, top_p, model, system_message
              </p>
            </div>

            {/* Checkbox Public */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="public"
                checked={formData.public}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <label className="ml-2 text-gray-700 font-medium">
                Rendre ce prompt public
              </label>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-blue-800 font-medium mb-2">💡 Informations</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Les prompts publics sont visibles par tous les utilisateurs</li>
                <li>• Les prompts privés ne sont visibles que par vous</li>
                <li>• Le compteur d'utilisations s'incrémente automatiquement</li>
              </ul>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!!jsonError || isSubmitting}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-colors font-medium ${
                jsonError || isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {prompt ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                prompt ? 'Mettre à jour' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}