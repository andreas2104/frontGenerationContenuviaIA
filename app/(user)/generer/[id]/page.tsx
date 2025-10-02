'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContenuById, useContenu } from '@/hooks/useContenu';
import { TailSpin } from 'react-loader-spinner';
import { useState, useEffect } from 'react';

export default function EditContenuPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { contenu, isPending: isLoading, error } = useContenuById(id ? Number(id) : undefined);
  const { updateContenu } = useContenu();
  
  const [formData, setFormData] = useState({
    titre: '',
    texte: '',
    image_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialiser le formulaire quand le contenu est chargé
  useEffect(() => {
    if (contenu) {
      setFormData({
        titre: contenu.titre || '',
        texte: contenu.texte || '',
        image_url: contenu.image_url || ''
      });
    }
  }, [contenu]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <TailSpin height={50} width={50} color="#3b82f6" />
      </div>
    );
  }

  if (error || !contenu) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error?.message || 'Erreur lors du chargement des données'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await updateContenu({
        id: contenu.id,
        updates: {
          titre: formData.titre,
          texte: formData.texte,
          image_url: formData.image_url,
          meta: contenu.meta // Conserver les métadonnées existantes
        }
      });
      router.push('/historique');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = 
    formData.titre !== contenu.titre ||
    formData.texte !== contenu.texte ||
    formData.image_url !== contenu.image_url;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Éditer le contenu #{id}
          </h1>
          <p className="text-gray-600">
            Modifiez les informations de votre contenu
          </p>
        </div>

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {saveError}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={e => handleChange('titre', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Donnez un titre à votre contenu"
              />
            </div>

            {/* Contenu selon le type */}
            {contenu.type_contenu === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Texte
                </label>
                <textarea
                  value={formData.texte}
                  onChange={e => handleChange('texte', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Saisissez votre texte ici..."
                />
              </div>
            )}

            {contenu.type_contenu === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  URL de l'image
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={e => handleChange('image_url', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                    <img 
                      src={formData.image_url} 
                      alt={formData.titre || 'Image'} 
                      className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Informations en lecture seule */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Informations</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Type :</span>
                  <span className="capitalize font-medium">{contenu.type_contenu}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID :</span>
                  <span className="font-medium">#{contenu.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Créé le :</span>
                  <span className="font-medium">
                    {new Date(contenu.date_creation).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {hasChanges && (
                  <span className="text-blue-600">● Modifications non sauvegardées</span>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isSaving || !hasChanges
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <TailSpin height={20} width={20} color="#ffffff" />
                      <span>Sauvegarde...</span>
                    </div>
                  ) : (
                    '💾 Sauvegarder'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}