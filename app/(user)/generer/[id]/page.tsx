'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContenu } from '@/hooks/useContenu';
import { ContenuPayload } from '@/types/contenu';
import { TailSpin } from 'react-loader-spinner';

export default function EditContenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getContenuById, updateContenu } = useContenu();

  // Utilisez l'état pour les données et le chargement
  const [payload, setPayload] = useState<ContenuPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le contenu une seule fois, après le premier rendu client
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getContenuById(Number(id))
        .then(data => {
          setPayload(data);
          setError(null);
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [id, getContenuById]);

  // Rendu conditionnel basé sur l'état de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin height={50} width={50} color="#4a90e2" />
      </div>
    );
  }

  // Gérer le cas où les données ne sont pas chargées ou une erreur s'est produite
  if (!payload) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p className="text-red-600">Erreur lors du chargement des données. {error}</p>
          </div>
      );
  }

  const handleChange = (key: keyof ContenuPayload, value: any) => {
    setPayload(p => (p ? { ...p, [key]: value } : null));
  };

  const handleSave = async () => {
    if (!payload) return;
    setIsSaving(true);
    try {
      await updateContenu(payload);
      router.push('/contenus');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Éditer le contenu #{id}</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            type="text"
            value={payload.titre || ''}
            onChange={e => handleChange('titre', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Texte (si type text) */}
        {payload.type_contenu === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-1">Texte</label>
            <textarea
              value={payload.texte || ''}
              onChange={e => handleChange('texte', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 h-48"
            />
          </div>
        )}

        {/* Image (si type image) */}
        {payload.type_contenu === 'image' && (
          <div>
            <label className="block text-sm font-medium mb-1">URL de l'image</label>
            <input
              type="text"
              value={payload.image_url || ''}
              onChange={e => handleChange('image_url', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        )}

        {/* Bouton de sauvegarde */}
        <button
          className={`px-4 py-2 rounded-md text-white ${
            isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>
    </div>
  );
}