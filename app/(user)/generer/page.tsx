'use client';
import { useState, useEffect } from 'react';
import { useCatalog } from '@/hooks/useFetch';
import { useGenerateContenu } from '@/hooks/useContenu';
import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
import { ContenuPayload } from '@/types/contenu';
import { TailSpin } from 'react-loader-spinner';
import { usePlateforme } from '@/hooks/usePlateforme';
import { usePublications } from '@/hooks/usePublication';
import { PublicationCreate, StatutPublicationEnum } from '@/types/publication';

// Nouveau type pour les images uploadées
interface ImageFile {
  file: File;
  preview: string;
}

function PublicationModal({
  isOpen,
  onClose,
  contenuId,
  contenuTitre,
  contenuTexte,
  contenuImageUrl,
  contenuType,
}: {
  isOpen: boolean;
  onClose: () => void;
  contenuId: number;
  contenuTitre?: string;
  contenuTexte?: string;
  contenuImageUrl?: string;
  contenuType?: string;
}) {
  const { actions, etatsChargement } = usePublications();
  const { plateformes, isLoading: isLoadingPlateformes } = usePlateforme();
  
  const [formData, setFormData] = useState({
    titre_publication: contenuTitre || '',
    message: contenuTexte || '',
    id_plateforme: '',
    date_programmee: '',
    statut: StatutPublicationEnum.brouillon
  });

  const [publicationImmediate, setPublicationImmediate] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Réinitialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre_publication: contenuTitre || '',
        message: contenuTexte || '',
        id_plateforme: '',
        date_programmee: '',
        statut: StatutPublicationEnum.brouillon
      });
      setPublicationImmediate(false);
      setNotification({ show: false, message: '', type: 'success' });
    }
  }, [isOpen, contenuTitre, contenuTexte]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_plateforme) {
      showNotification('Veuillez sélectionner une plateforme', 'error');
      return;
    }

    try {
      const publicationData: PublicationCreate = {
        id_contenu: contenuId,
        id_plateforme: parseInt(formData.id_plateforme),
        titre_publication: formData.titre_publication,
        message: formData.message,
        statut: publicationImmediate ? StatutPublicationEnum.programme : formData.statut,
        date_programmee: publicationImmediate ? new Date().toISOString() : (formData.date_programmee || undefined),
        meta: {
          image_url: contenuImageUrl,
          contenu_type: contenuType,
          created_from: 'modal'
        }
      };

      const result = await actions.creer(publicationData);
      
      // Si publication immédiate demandée
      if (publicationImmediate && result.id) {
        try {
          await actions.publier(result.id);
          showNotification('Publication créée et publiée avec succès !');
        } catch (publishError) {
          showNotification('Publication créée mais erreur lors de la publication', 'error');
        }
      } else {
        showNotification('Publication créée avec succès !');
      }

      // Fermer la modal après un délai
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      showNotification(`Erreur: ${error.message || 'Échec de la création'}`, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculer la date minimale (maintenant)
  const minDateTime = new Date().toISOString().slice(0, 16);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Publier le contenu
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Contenu #{contenuId} • {contenuType || 'Type inconnu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={etatsChargement.isCreating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mx-6 mt-4 p-3 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plateforme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plateforme *
            </label>
            <select
              name="id_plateforme"
              value={formData.id_plateforme}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isLoadingPlateformes || etatsChargement.isCreating}
            >
              <option value="">Sélectionnez une plateforme</option>
              {plateformes.map(plateforme => (
                <option key={plateforme.id} value={plateforme.id}>
                  {plateforme.nom}
                </option>
              ))}
            </select>
            {isLoadingPlateformes && (
              <p className="text-sm text-gray-500 mt-1">Chargement des plateformes...</p>
            )}
          </div>

          {/* Titre de la publication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la publication *
            </label>
            <input
              type="text"
              name="titre_publication"
              value={formData.titre_publication}
              onChange={handleChange}
              required
              placeholder="Donnez un titre à votre publication..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={etatsChargement.isCreating}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Rédigez votre message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              disabled={etatsChargement.isCreating}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500">
                {formData.message.length} caractères
              </p>
              {formData.message.length > 280 && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠️ Message long pour certaines plateformes
                </p>
              )}
            </div>
          </div>

          {/* Aperçu de l'image si disponible */}
          {contenuImageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image incluse
              </label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <img 
                  src={contenuImageUrl} 
                  alt="Aperçu" 
                  className="max-h-32 object-contain mx-auto rounded"
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Cette image sera jointe à la publication
                </p>
              </div>
            </div>
          )}

          {/* Options de publication */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800">Options de publication</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="publication-immediate"
                checked={publicationImmediate}
                onChange={(e) => setPublicationImmediate(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={etatsChargement.isCreating}
              />
              <label htmlFor="publication-immediate" className="ml-2 text-sm text-gray-700">
                Publier immédiatement
              </label>
            </div>

            {!publicationImmediate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programmer la publication
                </label>
                <input
                  type="datetime-local"
                  name="date_programmee"
                  value={formData.date_programmee}
                  onChange={handleChange}
                  min={minDateTime}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={etatsChargement.isCreating}
                />
              </div>
            )}

            {!publicationImmediate && !formData.date_programmee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={etatsChargement.isCreating}
                >
                  <option value={StatutPublicationEnum.brouillon}>Brouillon</option>
                  <option value={StatutPublicationEnum.programme}>Programmé (nécessite une date)</option>
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              disabled={etatsChargement.isCreating}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={etatsChargement.isCreating || !formData.id_plateforme}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center min-w-[140px] justify-center"
            >
              {etatsChargement.isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </>
              ) : publicationImmediate ? (
                'Publier maintenant'
              ) : formData.date_programmee ? (
                'Programmer'
              ) : (
                'Créer brouillon'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GenererContenuPage() {
  const { prompts, templates, models, projets, isPending, isError } = useCatalog();
  const { mutate: generate, data: result, isPending: isGenerating, error } = useGenerateContenu();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  const [payload, setPayload] = useState<ContenuPayload>({
    id_projet: 0,
    id_prompt: 0,
    id_model: 0,
    id_template: undefined,
    titre: '',
  });

  // ✅ NOUVEAU : État pour les images uploadées
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  // ✅ NOUVEAU : État pour la modal de publication
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);

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

  const canSubmit = payload.id_projet && payload.id_prompt && payload.id_model;

  // MODIFIÉ : Gestion de la génération avec images
  const handleGenerate = async () => {
    let imagesPayload: any[] = [];

    // Convertir les images si présentes et modèle multimodal
    if (images.length > 0 && selectedModel?.type_model === 'multimodal') {
      imagesPayload = await convertImagesToBase64();
    }

    const cleanPayload: ContenuPayload = {
      id_projet: Number(payload.id_projet),
      id_prompt: Number(payload.id_prompt),
      id_model: Number(payload.id_model),
      ...(payload.id_template && { id_template: Number(payload.id_template) }),
      ...(payload.titre && { titre: payload.titre }),
      ...(imagesPayload.length > 0 && { images: imagesPayload }) 
    };

    generate(cleanPayload);
  };

  // ✅ MODIFIÉ : Filtrer les projets - UNIQUEMENT ceux de l'utilisateur connecté
  const availableProjets = projets.data?.filter(p => 
    Number(p.id_utilisateur) === Number(utilisateur.id)
  ) || [];

  // ✅ MODIFIÉ : Les prompts peuvent rester avec la logique public/privé
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
            {/*  MODIFIÉ : Sélecteur de projet - confidentiel */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Projet <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  🔒 Confidentiel
                </span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                value={payload.id_projet || ''}
                onChange={(e) => onChange('id_projet', Number(e.target.value))}
              >
                <option value="" disabled className="text-gray-500">Choisir un projet</option>
                {availableProjets.map((projet) => (
                  <option key={projet.id} value={projet.id}>
                    {projet.nom_projet} 
                    {projet.status !== 'active' && ` (${projet.status})`}
                  </option>
                ))}
              </select>
              {availableProjets.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Aucun projet disponible.</strong><br />
                    Les projets sont personnels et confidentiels.
                    <a href="/projet" className="text-blue-600 hover:underline ml-1 font-medium">
                      Créez votre premier projet
                    </a>
                  </p>
                </div>
              )}
              {availableProjets.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  🔒 Projets personnels uniquement - confidentiels
                </p>
              )}
            </div>

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
                  <a href="/prompt" className="text-blue-600 hover:underline ml-1">
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
                <p className="text-sm">Sélectionnez un projet, un modèle et un prompt pour commencer</p>
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

              {/* Actions - MODIFIÉ : Ajout du bouton Publier */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(result.contenu);
                      }}
                    >
                      📋 Copier
                    </button>
                    {/* ✅ NOUVEAU : Bouton Publier */}
                    <button
                      className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50 transition-colors"
                      onClick={() => setIsPublicationModalOpen(true)}
                    >
                      📤 Publier
                    </button>
                  </div>
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
              👤 Connecté en tant que <strong>{utilisateur.nom}</strong>
              {isAdmin && <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-900 rounded text-xs font-medium">Admin</span>}
            </p>
          </div>
        </section>
      </div>

      {/* ✅ NOUVEAU : Modal de publication */}
      <PublicationModal
        isOpen={isPublicationModalOpen}
        onClose={() => setIsPublicationModalOpen(false)}
        contenuId={result?.id || 0}
        contenuTitre={result?.titre}
        contenuTexte={result?.contenu}
        contenuImageUrl={result?.type === 'image' ? result.contenu : undefined}
        contenuType={result?.type}
      />
    </div>
  );
}