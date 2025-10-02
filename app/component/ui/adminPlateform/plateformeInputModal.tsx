"use client";

import { usePlateforme } from "@/hooks/usePlateforme";
import {
  PlateformeConfig,
  PlateformeCreate,
  PlateformeUpdate,
} from "@/types/plateforme";
import { useEffect, useState } from "react";

type FormData = {
  nom: string;
  active: boolean;
  configurationText: string; // JSON stringifié
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
    active: plateforme?.active ?? true,
    configurationText: plateforme?.config
      ? JSON.stringify(plateforme.config, null, 2)
      : `{\n  "client_id": "",\n  "client_secret": "",\n  "scopes": []\n}`,
  });

  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (plateforme) {
      setFormData({
        nom: plateforme.nom,
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

      // Validation JSON en live
      try {
        JSON.parse(value);
        setJsonError(null);
      } catch {
        setJsonError("JSON invalide ⚠️");
      }
    } else if (name === "active") {
      setFormData((prev) => ({ ...prev, active: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const config = JSON.parse(formData.configurationText);

      const payload: PlateformeCreate | (PlateformeUpdate & { id: number }) =
        plateforme
          ? { id: plateforme.id, nom: formData.nom, config, active: formData.active }
          : { nom: formData.nom, config, active: formData.active };

      if (plateforme) {
        updatePlateforme(payload as PlateformeUpdate & { id: number });
      } else {
        addPlateforme(payload as PlateformeCreate);
      }

      onClose();
    } catch (err) {
      console.error("Erreur JSON:", err);
      setJsonError("Erreur : le JSON est invalide ⚠️");
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
              rows={7}
              className={`mt-1 p-2 w-full border rounded-md text-black ${
                jsonError ? "border-red-500" : ""
              }`}
              required
            ></textarea>
            {jsonError && (
              <p className="text-red-600 text-sm mt-1">{jsonError}</p>
            )}
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
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!!jsonError}
              className={`px-4 py-2 rounded-md ${
                jsonError
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {plateforme ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
