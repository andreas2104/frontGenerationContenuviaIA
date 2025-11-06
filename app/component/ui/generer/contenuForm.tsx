import { useState, useEffect } from 'react';
import { useCatalog } from '@/hooks/useFetch';
import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
import { ContenuPayload } from '@/types/contenu';
import { Upload, Plus, Sparkles, X } from 'lucide-react';

interface ImageFile {
  file: File;
  preview: string;
}

interface ContenuFormProps {
  onGenerate: (payload: ContenuPayload) => void;
  isGenerating: boolean;
  error: any;
}

export default function ContenuForm({ onGenerate, isGenerating, error }: ContenuFormProps) {
  const { prompts, templates, models, projets } = useCatalog();
  const { utilisateur, isAdmin } = useCurrentUtilisateur();

  const [payload, setPayload] = useState<ContenuPayload>({
    id_projet: 0,
    id_prompt: 0,
    id_model: 0,
    id_template: undefined,
    titre: '',
    custom_prompt: '',
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);

  useEffect(() => {
    if (payload.id_model && models.data) {
      const model = models.data.find(m => m.id === payload.id_model);
      setSelectedModel(model);
    } else {
      setSelectedModel(null);
    }
  }, [payload.id_model, models.data]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImages.push({
          file,
          preview: URL.createObjectURL(file)
        });
      }
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleGenerate = async () => {
    const cleanPayload: ContenuPayload = {
      id_projet: Number(payload.id_projet),
      id_prompt: useCustomPrompt ? 0 : Number(payload.id_prompt),
      id_model: Number(payload.id_model),
      ...(payload.id_template && { id_template: Number(payload.id_template) }),
      ...(payload.titre && { titre: payload.titre }),
      ...(useCustomPrompt && payload.custom_prompt && { custom_prompt: payload.custom_prompt }),
      ...(images.length > 0 && { 
        images: images.map(img => ({
          file: img.file,
          name: img.file.name
        }))
      })
    };

    onGenerate(cleanPayload);
  };

  const onChange = (key: keyof ContenuPayload, value: any) => {
    setPayload((p) => ({ ...p, [key]: value }));
  };

  const canSubmit = payload.id_projet && payload.id_model && 
    (useCustomPrompt ? payload.custom_prompt : payload.id_prompt);

  const availableProjets = projets.data?.filter(p => 
    Number(p.id_utilisateur) === Number(utilisateur?.id)
  ) || [];

  const availablePrompts = prompts.data?.filter(p => {
    if (isAdmin) return true;
    return p.public || Number(p.id_utilisateur) === Number(utilisateur?.id);
  }) || [];

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Générer du contenu</h1>

      <div className="space-y-4">
        {/* Projet */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Projet <span className="text-red-500">*</span>
            <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              🔒 Confidentiel
            </span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={payload.id_projet || ''}
            onChange={(e) => onChange('id_projet', Number(e.target.value))}
          >
            <option value="">Choisir un projet</option>
            {availableProjets.map((projet) => (
              <option key={projet.id} value={projet.id}>
                {projet.nom_projet}
              </option>
            ))}
          </select>
          {availableProjets.length === 0 && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Aucun projet disponible.</strong>
                <a href="/projet" className="text-blue-600 hover:underline ml-1 font-medium">
                  Créez votre premier projet
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Modèle */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Modèle IA <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={payload.id_model || ''}
            onChange={(e) => onChange('id_model', Number(e.target.value))}
          >
            <option value="">Choisir un modèle</option>
            {models.data?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom_model} ({m.type_model})
              </option>
            ))}
          </select>
          {selectedModel?.type_model === 'multimodal' && (
            <p className="text-sm text-blue-600 mt-1">✓ Supporte les images</p>
          )}
        </div>

        {/* Upload images pour modèles multimodaux */}
        {selectedModel?.type_model === 'multimodal' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Images (optionnel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Cliquez pour ajouter des images</span>
              </label>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section Prompt avec Custom Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Prompt <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseCustomPrompt(!useCustomPrompt)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                useCustomPrompt
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {useCustomPrompt ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  Prompt Personnalisé
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Utiliser un Prompt Personnalisé
                </>
              )}
            </button>
          </div>

          {useCustomPrompt ? (
            <div className="space-y-2">
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
                rows={4}
                placeholder="Écrivez votre prompt personnalisé ici..."
                value={payload.custom_prompt || ''}
                onChange={(e) => onChange('custom_prompt', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                💡 Écrivez des instructions détaillées pour générer le contenu souhaité
              </p>
            </div>
          ) : (
            <select
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={payload.id_prompt || ''}
              onChange={(e) => onChange('id_prompt', Number(e.target.value))}
            >
              <option value="">Choisir un prompt</option>
              {availablePrompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom_prompt || p.texte_prompt.substring(0, 40)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Template (optionnel)
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={payload.id_template || ''}
            onChange={(e) => onChange('id_template', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Sans template</option>
            {templates.data?.map((t) => (
              <option key={t.id} value={t.id}>{t.nom_template}</option>
            ))}
          </select>
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Titre (optionnel)
          </label>
          <input
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Titre du contenu"
            value={payload.titre || ''}
            onChange={(e) => onChange('titre', e.target.value)}
          />
        </div>

        {/* Bouton Générer */}
        <button
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 font-medium transition-colors disabled:cursor-not-allowed"
          disabled={!canSubmit || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </span>
          ) : (
            `Générer le contenu ${useCustomPrompt ? 'avec prompt personnalisé' : ''}`
          )}
        </button>

        {error && (
          <div className="text-red-600 p-3 border border-red-200 rounded-md bg-red-50">
            <p className="font-medium">❌ Erreur : {error.message}</p>
          </div>
        )}
      </div>
    </section>
  );
}