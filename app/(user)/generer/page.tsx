'use client';
import { useState, useEffect } from 'react';
import { useCatalog } from '@/hooks/useFetch';
import { useGenerateContenu } from '@/hooks/useContenu';
import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
import { ContenuPayload } from '@/types/contenu';
import { TailSpin } from 'react-loader-spinner';

// Nouveau type pour les images uploadées
interface ImageFile {
  file: File;
  preview: string;
}

export default function GenererContenuPage() {
  const { prompts, templates, models, isPending, isError } = useCatalog();
  const { mutate: generate, data: result, isPending: isGenerating, error } = useGenerateContenu();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  const [payload, setPayload] = useState<ContenuPayload>({
    id_prompt: 0,
    id_model: 0,
    id_template: undefined,
    titre: '',
  });

  // ✅ NOUVEAU : État pour les images uploadées
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);

  // ✅ NOUVEAU : Détecter si le modèle sélectionné est multimodal
  useEffect(() => {
    if (payload.id_model && models.data) {
      const model = models.data.find(m => m.id === payload.id_model);
      setSelectedModel(model);
    } else {
      setSelectedModel(null);
    }
  }, [payload.id_model, models.data]);

  // ✅ NOUVEAU : Gestion de l'upload d'images
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

  // ✅ NOUVEAU : Supprimer une image
  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // ✅ NOUVEAU : Convertir images en base64 pour l'API
  const convertImagesToBase64 = async (): Promise<any[]> => {
    const base64Images = [];
    
    for (const img of images) {
      try {
        const base64 = await fileToBase64(img.file);
        base64Images.push({
          base64: base64.split(',')[1], // Retirer le prefix data:image/...
          mime_type: img.file.type
        });
      } catch (error) {
        console.error('Erreur conversion image:', error);
      }
    }
    
    return base64Images;
  };

  // ✅ NOUVEAU : Helper pour conversion fichier -> base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if (isPending || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <TailSpin height="50" width="50" color="#4a90e2" ariaLabel="Chargement..." />
        <div className="text-xl font-semibold text-gray-700 ml-4">Chargement...</div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl text-red-600">
          Utilisateur non connecté
          <div className="mt-4">
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Aller à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  const onChange = (key: keyof ContenuPayload, value: any) => {
    setPayload((p) => ({ ...p, [key]: value }));
  };

  const canSubmit = payload.id_prompt && payload.id_model;

  // ✅ MODIFIÉ : Gestion de la génération avec images
  const handleGenerate = async () => {
    let imagesPayload: any[] = [];

    // Convertir les images si présentes et modèle multimodal
    if (images.length > 0 && selectedModel?.type_model === 'multimodal') {
      imagesPayload = await convertImagesToBase64();
    }

    const cleanPayload: ContenuPayload = {
      id_prompt: Number(payload.id_prompt),
      id_model: Number(payload.id_model),
      ...(payload.id_template && { id_template: Number(payload.id_template) }),
      ...(payload.titre && { titre: payload.titre }),
      ...(imagesPayload.length > 0 && { images: imagesPayload }) // ✅ Ajout des images
    };

    generate(cleanPayload);
  };

  const availablePrompts = prompts.data?.filter(p => {
    if (isAdmin) return true;
    return p.public || Number(p.id_utilisateur) === Number(utilisateur.id);
  }) || [];

  return (
    <div className="p-4 bg-gray-100 min-h-screen"> 
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-6">
        
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Générer du contenu</h1>

          {isError && (
            <div className="text-red-600 p-4 border border-red-200 rounded mb-4 bg-red-50">
              Erreur de chargement des catalogues. Vérifiez votre connexion.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Modèle IA <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                value={payload.id_model || ''}
                onChange={(e) => onChange('id_model', Number(e.target.value))}
              >
                <option value="" disabled className="text-gray-500">Choisir un modèle</option>
                {models.data?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom_model} ({m.fournisseur}) - {m.type_model}
                  </option>
                ))}
              </select>
              {selectedModel && (
                <p className="text-sm text-gray-600 mt-1">
                  Type: <span className="font-medium">{selectedModel.type_model}</span>
                  {selectedModel.type_model === 'multimodal' && (
                    <span className="ml-2 text-blue-600">✓ Supporte les images</span>
                  )}
                </p>
              )}
            </div>

            {/* ✅ NOUVEAU : Section upload d'images pour modèles multimodaux */}
            {selectedModel?.type_model === 'multimodal' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Images à analyser (optionnel)
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
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Cliquez pour ajouter des images
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, JPEG jusqu'à 5MB
                      </span>
                    </div>
                  </label>
                  
                  {/* Aperçu des images */}
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
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {images.length} image(s) sélectionnée(s)
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Prompt <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                value={payload.id_prompt || ''}
                onChange={(e) => onChange('id_prompt', Number(e.target.value))}
              >
                <option value="" disabled className="text-gray-500">Choisir un prompt</option>
                {availablePrompts.map((p) => {
                  const isOwner = Number(p.id_utilisateur) === Number(utilisateur.id);
                  const displayText = p.nom_prompt || 
                    (p.texte_prompt.length > 40 
                      ? `${p.texte_prompt.substring(0, 40)}...` 
                      : p.texte_prompt);
                  
                  return (
                    <option key={p.id} value={p.id}>
                      {displayText} {p.public ? '(Public)' : isOwner ? '(Privé)' : ''}
                    </option>
                  );
                })}
              </select>
              {availablePrompts.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Aucun prompt disponible. 
                  <a href="/prompts" className="text-blue-600 hover:underline ml-1">
                    Créez-en un nouveau
                  </a>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Template (optionnel)
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                value={payload.id_template || ''}
                onChange={(e) => 
                  onChange('id_template', e.target.value ? Number(e.target.value) : undefined)
                }
              >
                <option value="" className="text-gray-500">Sans template</option>
                {templates.data?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nom_template}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Titre (optionnel)
              </label>
              <input
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Donnez un titre à votre contenu"
                value={payload.titre || ''}
                onChange={(e) => onChange('titre', e.target.value)}
              />
            </div>

            <button
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 font-medium transition-colors"
              disabled={!canSubmit || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </span>
              ) : (
                `Générer le contenu ${images.length > 0 ? 'avec images' : ''}`
              )}
            </button>

            {/* Affichage des erreurs */}
            {error && (
              <div className="text-red-600 p-3 border border-red-200 rounded-md bg-red-50">
                <p className="font-medium">❌ Erreur lors de la génération :</p>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            )}
          </div>
        </section>

        {/* Section Résultat - MODIFIÉ pour afficher le contenu multimodal */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Résultat</h2>
          
          {!result ? (
            <div className="text-gray-500 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto h-16 w-16 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-600">Le contenu généré apparaîtra ici</p>
                <p className="text-sm">Sélectionnez un modèle et un prompt pour commencer</p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header du résultat */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      result.type === 'multimodal' 
                        ? 'bg-purple-100 text-purple-800'
                        : result.type === 'image'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      ✅ {result.type}
                      {result.type === 'multimodal' && ' 📷'}
                    </span>
                    <span className="text-sm text-gray-600">
                      Généré avec succès
                    </span>
                  </div>
                  <button
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    onClick={handleGenerate}
                    disabled={!canSubmit || isGenerating}
                  >
                    🔄 Régénérer
                  </button>
                </div>
              </div>

              {/* Contenu généré - MODIFIÉ pour multimodal */}
              <div className="p-4">
                {result.type === 'image' ? (
                  <div className="space-y-3">
                    <img 
                      src={result.contenu} 
                      alt="Contenu généré" 
                      className="max-w-full h-auto rounded border"
                    />
                    <p className="text-sm text-gray-600 break-all">
                      <strong>URL:</strong> {result.contenu}
                    </p>
                  </div>
                ) : result.type === 'multimodal' ? (
                  // ✅ NOUVEAU : Affichage pour contenu multimodal
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded border">
                      <h3 className="font-medium text-gray-700 mb-2">Analyse multimodale :</h3>
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-white p-3 rounded overflow-auto max-h-96 text-gray-800">
                        {result.contenu}
                      </pre>
                    </div>
                    {result.structure && (
                      <div className="text-sm text-gray-600">
                        <strong>Structure:</strong> {JSON.stringify(result.structure, null, 2)}
                      </div>
                    )}
                  </div>
                ) : (
                  // Affichage texte classique
                  <div className="space-y-3">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-4 rounded border overflow-auto max-h-96 text-gray-800"> 
                      {result.contenu}
                    </pre>
                    <div className="text-sm text-gray-500">
                      {result.contenu.length} caractères
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(result.contenu);
                    }}
                  >
                    📋 Copier
                  </button>
                  <div className="flex space-x-2">
                    <a
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      href="/contenus"
                    >
                      📚 Mes contenus
                    </a>
                    {result.type === 'text' && (
                      <button
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          // TODO: Sauvegarder comme nouveau prompt
                          console.log('Sauvegarder comme prompt');
                        }}
                      >
                        💾 Sauver comme prompt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations utilisateur */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              👤 Connecté en tant que <strong>{utilisateur.nom_utilisateur}</strong>
              {isAdmin && <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-900 rounded text-xs font-medium">Admin</span>}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}