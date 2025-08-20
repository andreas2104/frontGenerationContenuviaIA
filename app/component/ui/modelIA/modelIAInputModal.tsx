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

export default function ModelIAInputModal({ onClose, modelIA }: {onClose: () => void, modelIA: ModelIA | null}) {
  const { addModelIA, updateModelIA } = useModelIA();

  const [formData, setFormData] = useState<FormData>({
    nom_model: modelIA?.nom_model ?? '',
    fournisseur: modelIA?.fournisseur ?? '',
    type_model: modelIA?.type_model ?? 'text',
    api_endpoint: modelIA?.api_endpoint ?? '', 
    parametres_default: modelIA?.parametres_default ? JSON.stringify(modelIA.parametres_default, null, 2) : '',
    cout_par_token: modelIA?.cout_par_token ?? 0,
    actif: modelIA?.actif ?? false,
  });

  useEffect(() => {
    if (modelIA) {
      setFormData({
        nom_model: modelIA.nom_model,
        fournisseur: modelIA.fournisseur,
        type_model: modelIA.type_model,
        api_endpoint: modelIA.api_endpoint,
        parametres_default: modelIA.parametres_default ? JSON.stringify(modelIA.parametres_default, null, 2) : '',
        cout_par_token: modelIA.cout_par_token,
        actif: modelIA.actif,
      });
    }
  }, [modelIA]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const modelIAData: ModelIA = {
        id: modelIA?.id ?? Date.now(),
        nom_model: formData.nom_model,
        type_model: formData.type_model,
        fournisseur: formData.fournisseur,
        api_endpoint: formData.api_endpoint,
        parametres_default: formData.parametres_default ? JSON.parse(formData.parametres_default) : null,
        cout_par_token: Number(formData.cout_par_token),
        actif: formData.actif,
      };
      
      if (modelIA) {
        updateModelIA(modelIAData);
      } else {
        addModelIA(modelIAData);
      }
      onClose(); // Ferme la modale après la soumission réussie
      alert("Données ajoutées/modifiées avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      alert("Veuillez vérifier les paramètres JSON. Ils doivent être au format {'clé':'valeur'}.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] text-black shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{modelIA ? 'Modifier un Modèle IA' : 'Ajouter un Modèle IA'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nom du modèle</label>
            <input 
              type="text"
              name="nom_model"
              value={formData.nom_model}
              onChange={handleChange}
              placeholder="Nom du modèle"
              className="border w-full p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Type de modèle</label>
            <select
              name="type_model"
              value={formData.type_model}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="multimodal">Multimodal</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700">Fournisseur</label>
            <input
              type="text"
              name="fournisseur"
              value={formData.fournisseur}
              onChange={handleChange}
              placeholder="Fournisseur"
              className="border w-full p-2 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Endpoint API</label>
            <input 
              type="text"
              name="api_endpoint"
              value={formData.api_endpoint}
              onChange={handleChange}
              placeholder="Endpoint API"
              className="border w-full p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Coût par token</label>
            <input 
              type="number"
              name="cout_par_token"
              value={formData.cout_par_token}
              onChange={handleChange}
              placeholder="Coût par token"
              className="border w-full p-2 rounded"
              step="0.0001" 
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Paramètres par défaut (JSON)</label>
            <textarea 
              name="parametres_default"
              value={formData.parametres_default}
              onChange={handleChange}
              placeholder="Paramètres par défaut (format JSON)"
              className="border w-full p-2 rounded font-mono text-sm h-40"
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox"
              name="actif"
              checked={formData.actif}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Actif</label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {modelIA ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}