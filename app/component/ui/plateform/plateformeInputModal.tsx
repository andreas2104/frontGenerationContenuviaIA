"use client";

import { usePlateforme } from "@/hooks/usePlateforme";
import { PlateformeConfig, PlateformeCreate, PlateformeUpdate } from "@/types/plateforme";
import { useEffect, useState } from "react";

type FormData = {
  nom: string;
  config: {
    client_id: string;
    client_secret: string;
    scopes?: string[];
    [key: string]: any;
  };
  active: boolean;
  configurationText: string;
};

export default function PlateformeInputModal({
  onClose,
  plateforme,
}: {
  onClose: () => void;
  plateforme: PlateformeConfig | null;
}) {
  const { addPlateforme, updatePlateforme } = usePlateforme();

  const [formData, setFormData] = useState<FormData>({
    nom: plateforme?.nom ?? "",
    config: plateforme?.config ?? { client_id: "", client_secret: "", scopes: [] },
    active: plateforme?.active ?? true,
    configurationText: plateforme?.config 
      ? JSON.stringify(plateforme.config, null, 2) 
      : JSON.stringify({ client_id: "", client_secret: "", scopes: [] }, null, 2),
  });

  useEffect(() => {
    if (plateforme) {
      setFormData({
        nom: plateforme.nom,
        config: plateforme.config,
        active: plateforme.active,
        configurationText: JSON.stringify(plateforme.config, null, 2),
      });
    }
  }, [plateforme]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "configurationText") {
      setFormData((prev) => ({ ...prev, configurationText: value }));
    } else if (name === "active") {
      setFormData((prev) => ({ ...prev, active: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validation et parsing du JSON
      let config;
      try {
        config = JSON.parse(formData.configurationText);
      } catch (parseError) {
        alert("Erreur : Le JSON de configuration n'est pas valide ⚠️");
        return;
      }

      // Validation des champs requis
      if (!formData.nom.trim()) {
        alert("Erreur : Le nom de la plateforme est requis ⚠️");
        return;
      }

      if (!config.client_id || !config.client_secret) {
        alert("Erreur : client_id et client_secret sont requis dans la configuration ⚠️");
        return;
      }

      console.log("Données à envoyer:", { 
        nom: formData.nom, 
        config, 
        active: formData.active 
      });

      if (plateforme) {
        // Mode modification
        const updatePayload: PlateformeUpdate = {
          nom: formData.nom,
          config: config,
          active: formData.active,
        };
        
        await updatePlateforme(plateforme.id, updatePayload);
        alert("Plateforme mise à jour avec succès ✅");
      } else {
        // Mode création
        const createPayload: PlateformeCreate = {
          nom: formData.nom,
          config: config,
          active: formData.active,
        };
        
        await addPlateforme(createPayload);
        alert("Plateforme ajoutée avec succès ✅");
      }

      onClose();
    } catch (err: any) {
      console.error("Erreur lors de la soumission :", err);
      
      // Affichage d'erreur plus détaillé
      if (err.response?.data) {
        alert(`Erreur serveur : ${JSON.stringify(err.response.data)} ⚠️`);
      } else if (err.message) {
        alert(`Erreur : ${err.message} ⚠️`);
      } else {
        alert("Erreur inconnue lors de la soumission ⚠️");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl text-black mb-4">
          {plateforme ? "Modifier la plateforme" : "Ajouter une plateforme"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Nom plateforme */}
          <div className="mb-4">
            <label className="block text-black">Nom de la plateforme</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md text-black"
              required
            />
          </div>

          {/* Configuration JSON */}
          <div className="mb-4">
            <label className="block text-black">Configuration (JSON)</label>
            <textarea
              name="configurationText"
              value={formData.configurationText}
              onChange={handleChange}
              rows={8}
              className="mt-1 p-2 w-full border rounded-md text-black font-mono text-sm"
              placeholder='{"client_id": "votre_client_id", "client_secret": "votre_secret", "scopes": []}'
              required
            />
            <small className="text-gray-500">
              Format requis : JSON avec au minimum client_id et client_secret
            </small>
          </div>

          {/* Actif */}
          <div className="mb-4">
            <label className="block text-black">Active</label>
            <select
              name="active"
              value={formData.active ? "true" : "false"}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md text-black"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {plateforme ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}