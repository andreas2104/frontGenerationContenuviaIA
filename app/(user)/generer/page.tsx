'use client';
import { useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { useGenerateContenu } from '@/hooks/useContenu';
import type { ContenuPayload } from '@/services/contenuService';

export default function GenererContenuPage() {
  const { prompts, templates, models, isPending, isError } = useCatalog();
  const { mutate: generate, data: result, isPending: isGenerating, error } = useGenerateContenu();

  const [payload, setPayload] = useState<ContenuPayload>({
    id_utilisateur: 1, // ← récupère ça du store auth dans ton app
    id_prompt: 0,
    id_model: 0,
    id_template: undefined,
    titre: '',
  });
  console.log('data prompt:', prompts);
  console.log('data template:', templates); 
  console.log('data model:', models); 
  console.log('data contenu:', result);

  const onChange = (key: keyof ContenuPayload, value: any) =>
    setPayload((p) => ({ ...p, [key]: value }));

  const canSubmit = payload.id_utilisateur && payload.id_prompt && payload.id_model;

  return (
    <div className="mx-auto max-w-6xl p-4 grid md:grid-cols-2 gap-6">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Générer du contenu</h1>

        {isPending && <div className="animate-pulse h-24 rounded bg-gray-200" />}
        {isError && <p className="text-red-600">Erreur de chargement des catalogues</p>}

        {!isPending && !isError && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Modèle IA</label>
              <select
                className="w-full border rounded p-2"
                value={payload.id_model || ''}
                onChange={(e) => onChange('id_model', Number(e.target.value))}
              >
                <option value="" disabled>Choisir un modèle</option>
                {models.data?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom_model} ({m.fournisseur})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Prompt</label>
              <select
                className="w-full border rounded p-2"
                value={payload.id_prompt || ''}
                onChange={(e) => onChange('id_prompt', Number(e.target.value))}
              >
                <option value="" disabled>Choisir un prompt</option>
                {prompts.data?.map((p) => (
                  // <option key={p.id} value={p.id}>{p.titre}</option>
                  <option key={p.id} value={p.id}>{p.texte_prompt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Template (optionnel)</label>
              <select
                className="w-full border rounded p-2"
                value={payload.id_template || ''}
                onChange={(e) => onChange('id_template', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Sans template</option>
                {templates.data?.map((t) => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Titre (optionnel)</label>
              <input
                className="w-full border rounded p-2"
                placeholder="Mon contenu"
                value={payload.titre ?? ''}
                onChange={(e) => onChange('titre', e.target.value)}
              />
            </div>

            <button
              className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
              disabled={!canSubmit || isGenerating}
              onClick={() => generate(payload)}
            >
              {isGenerating ? 'Génération...' : 'Générer'}
            </button>

            {error && <p className="text-red-600">{error.message}</p>}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Aperçu</h2>
        {!result ? (
          <div className="text-gray-500 border rounded p-4">Le contenu généré apparaîtra ici.</div>
        ) : (
          <div className="border rounded p-4 space-y-2">
            <div className="text-sm text-gray-500">Type: {result.type}</div>
            <pre className="whitespace-pre-wrap">{result.contenu}</pre>
            <div className="flex gap-2">
              <button
                className="rounded border px-3 py-2"
                onClick={() => generate(payload)}
              >
                Régénérer
              </button>
              <a
                className="rounded border px-3 py-2"
                href="/historique"
              >
                Voir l’historique
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}