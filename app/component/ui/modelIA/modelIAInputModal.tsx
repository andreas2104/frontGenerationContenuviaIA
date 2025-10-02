'use client'

import { useModelIA } from "@/hooks/useModelIA";
import { ModelIA } from "@/types/modelIA";
import { useEffect, useState } from "react";

type FormData = {  
  nom_model: string;
  fournisseur: string;
  type_model: "text" | "image" | "multimodal";
  api_endpoint: string;
  parametres_default?: string;
  cout_par_token: number;
  actif: boolean;
}

interface ModelIAInputModalProps {
  onClose: () => void;
  modelIA: ModelIA | null;
  onSuccess?: (type: 'add' | 'edit', nomModel: string) => void;
}

export default function ModelIAInputModal({ onClose, modelIA, onSuccess }: ModelIAInputModalProps) {
  const { addModelIA, updateModelIA } = useModelIA();

  const defaultJsonTemplate = `{
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1.0,
  "frequency_penalty": 0,
  "presence_penalty": 0
}`;

  const [formData, setFormData] = useState<FormData>({
    nom_model: modelIA?.nom_model ?? '',
    fournisseur: modelIA?.fournisseur ?? '',
    type_model: modelIA?.type_model ?? 'text',
    api_endpoint: modelIA?.api_endpoint ?? '', 
    parametres_default: modelIA?.parametres_default 
      ? JSON.stringify(modelIA.parametres_default, null, 2) 
      : defaultJsonTemplate,
    cout_par_token: modelIA?.cout_par_token ?? 0,
    actif: modelIA?.actif ?? false,
  });

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modelIA) {
      setFormData({
        nom_model: modelIA.nom_model,
        fournisseur: modelIA.fournisseur,
        type_model: modelIA.type_model,
        api_endpoint: modelIA.api_endpoint,
        parametres_default: modelIA.parametres_default 
          ? JSON.stringify(modelIA.parametres_default, null, 2) 
          : defaultJsonTemplate,
        cout_par_token: modelIA.cout_par_token,
        actif: modelIA.actif,
      });
    }
  }, [modelIA]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === "parametres_default") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      try {
        if (value.trim()) {
          JSON.parse(value);
          setJsonError(null);
        } else {
          setJsonError(null);
        }
      } catch {
        setJsonError("JSON invalide ⚠️");
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
    
    // Effacer l'erreur générale quand l'utilisateur modifie le formulaire
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Validation des champs requis
    if (!formData.nom_model.trim()) {
      setError("Le nom du modèle est obligatoire.");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.fournisseur.trim()) {
      setError("Le fournisseur est obligatoire.");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.api_endpoint.trim()) {
      setError("L'endpoint API est obligatoire.");
      setIsSubmitting(false);
      return;
    }

    if (formData.parametres_default && formData.parametres_default.trim()) {
      try {
        JSON.parse(formData.parametres_default);
      } catch (error) {
        setError("Veuillez corriger le format JSON avant de soumettre.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const modelIAData: ModelIA = {
        id: modelIA?.id ?? Date.now(),
        nom_model: formData.nom_model,
        type_model: formData.type_model,
        fournisseur: formData.fournisseur,
        api_endpoint: formData.api_endpoint,
        parametres_default: formData.parametres_default && formData.parametres_default.trim() 
          ? JSON.parse(formData.parametres_default) 
          : null,
        cout_par_token: Number(formData.cout_par_token),
        actif: formData.actif,
      };
      
      if (modelIA) {
        await updateModelIA(modelIAData);
        onSuccess?.('edit', formData.nom_model);
      } else {
        await addModelIA(modelIAData);
        onSuccess?.('add', formData.nom_model);
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue lors de la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {modelIA ? 'Modifier un Modèle IA' : 'Ajouter un Modèle IA'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Nom du modèle *
              </label>
              <input 
                type="text"
                name="nom_model"
                value={formData.nom_model}
                onChange={handleChange}
                placeholder="ex: GPT-4, Claude-2, DALL-E 3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Type de modèle *
              </label>
              <select
                name="type_model"
                value={formData.type_model}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                disabled={isSubmitting}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="multimodal">Multimodal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Fournisseur *
              </label>
              <input
                type="text"
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleChange}
                placeholder="ex: OpenAI, Anthropic, Google"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Endpoint API *
              </label>
              <input 
                type="text"
                name="api_endpoint"
                value={formData.api_endpoint}
                onChange={handleChange}
                placeholder="ex: https://api.openai.com/v1/chat/completions"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Coût par token *
              </label>
              <input 
                type="number"
                name="cout_par_token"
                value={formData.cout_par_token}
                onChange={handleChange}
                placeholder="0.0000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                step="0.0001" 
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                Paramètres par défaut (JSON)
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  parametres_default: defaultJsonTemplate
                }))}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Réinitialiser le template
              </button>
            </div>
            <textarea 
              name="parametres_default"
              value={formData.parametres_default}
              onChange={handleChange}
              placeholder="Paramètres par défaut au format JSON"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm min-h-[120px] resize-y text-gray-900 placeholder-gray-500 ${
                jsonError ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'opacity-50' : ''}`}
              disabled={isSubmitting}
            />
            {jsonError && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {jsonError}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Paramètres communs : temperature, max_tokens, top_p, frequency_penalty, presence_penalty
            </p>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox"
              name="actif"
              checked={formData.actif}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <label className="ml-2 text-gray-700 font-medium">Actif</label>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
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
              className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center ${
                jsonError || isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {modelIA ? 'Modification...' : 'Ajout...'}
                </>
              ) : (
                modelIA ? 'Modifier' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}