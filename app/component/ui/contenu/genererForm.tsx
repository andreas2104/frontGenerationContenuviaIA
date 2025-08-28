"use client";

import { useState } from "react";
import { useGenerateContenu } from "@/hooks/useContenu";

export default function GenerateForm() {
  const [idUtilisateur, setIdUtilisateur] = useState<number>(1);
  const [idPrompt, setIdPrompt] = useState<number>(1);
  const [idModel, setIdModel] = useState<number>(1);
  const [titre, setTitre] = useState<string>("");

  const generate = useGenerateContenu();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate.mutate({
      id_utilisateur: idUtilisateur,
      id_prompt: idPrompt,
      id_model: idModel,
      titre: titre || "Contenu généré",
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white text-gray-500 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Génération de contenu IA</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">ID Utilisateur</label>
          <input
            type="number"
            value={idUtilisateur}
            onChange={(e) => setIdUtilisateur(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ID Prompt</label>
          <input
            type="number"
            value={idPrompt}
            onChange={(e) => setIdPrompt(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ID Model</label>
          <input
            type="number"
            value={idModel}
            onChange={(e) => setIdModel(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Titre (optionnel)</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={generate.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {generate.isPending ? "Génération..." : "Générer"}
        </button>
      </form>

      {/* Zone de statut */}
      <div className="mt-4">
        {generate.isError && (
          <p className="text-red-600">
            Erreur : {(generate.error as Error).message}
          </p>
        )}
        {generate.isSuccess && (
          <div className="p-3 bg-green-100 rounded">
            <h3 className="font-semibold">✅ Contenu généré :</h3>
            <p><strong>Message:</strong> {generate.data.message}</p>
            <p><strong>Type:</strong> {generate.data.type}</p>
            <p><strong>Texte:</strong> {generate.data.contenu}</p>
          </div>
        )}
      </div>
    </div>
  );
};


