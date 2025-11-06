import { useState, useEffect } from 'react';
import { usePublications } from '@/hooks/usePublication';
import { usePlateforme } from '@/hooks/usePlateforme';
import { PublicationCreate, StatutPublicationEnum } from '@/types/publication';
import { Check, Eye, Edit3, Calendar, Send, X } from 'lucide-react';

interface PublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contenuId: number;
  contenuTitre?: string;
  contenuTexte?: string;
  contenuImageUrl?: string;
  contenuType?: string;
}

export default function PublicationModal({
  isOpen,
  onClose,
  contenuId,
  contenuTitre,
  contenuTexte,
  contenuImageUrl,
  contenuType
}: PublicationModalProps) {
  const { actions, etatsChargement } = usePublications();
  const { plateformes, isLoading: isLoadingPlateformes } = usePlateforme();

  const [formData, setFormData] = useState({
    titre_publication: contenuTitre || '',
    message: contenuTexte || '',
    plateforme: 'x',
    date_programmee: '',
  });

  const [publicationImmediate, setPublicationImmediate] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre_publication: contenuTitre || `Publication ${new Date().toLocaleDateString()}`,
        message: contenuTexte || '',
        plateforme: 'x',
        date_programmee: '',
      });
      setPublicationImmediate(false);
      setModeEdition(false);
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

    if (!formData.plateforme) {
      showNotification('Veuillez sélectionner une plateforme', 'error');
      return;
    }

    try {
      const publicationData: PublicationCreate = {
        id_contenu: contenuId,
        plateforme: formData.plateforme,
        titre_publication: formData.titre_publication,
        message: formData.message,
        image_url: contenuImageUrl,
        statut: publicationImmediate
          ? StatutPublicationEnum.publie
          : formData.date_programmee
          ? StatutPublicationEnum.programme
          : StatutPublicationEnum.brouillon,
        date_programmee: publicationImmediate ? undefined : (formData.date_programmee || undefined),
      };

      await actions.creer(publicationData);

      let message = '';
      if (publicationImmediate) {
        message = '✅ Publication créée et publiée avec succès sur X !';
      } else if (formData.date_programmee) {
        message = '⏰ Publication programmée avec succès !';
      } else {
        message = '📝 Brouillon créé avec succès !';
      }

      showNotification(message);
      setTimeout(() => onClose(), 1500);

    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      showNotification(`❌ Erreur: ${error.message || 'Échec de la création'}`, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Publier le contenu</h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              Contenu #{contenuId} • {contenuType || 'Type inconnu'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
              Publication sur {formData.plateforme.toUpperCase()}
            </span>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={etatsChargement.isCreating}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mx-4 sm:mx-6 mt-4 p-3 sm:p-4 rounded-lg border-2 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              )}
              <span className="font-semibold text-sm sm:text-base">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Colonne Configuration */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ⚙️ Configuration
                </h3>

                {/* Sélecteur plateforme */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Plateforme *
                  </label>
                  <select
                    name="plateforme"
                    value={formData.plateforme}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoadingPlateformes || etatsChargement.isCreating}
                  >
                    <option value="x">X (Twitter)</option>
                    {plateformes.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Bouton édition */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModeEdition(!modeEdition)}
                    className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 flex items-center"
                  >
                    {modeEdition ? <Eye className="w-3 h-3 mr-1" /> : <Edit3 className="w-3 h-3 mr-1" />}
                    {modeEdition ? 'Aperçu' : 'Personnaliser'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Titre */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Titre de la publication *
                    </label>
                    <input
                      type="text"
                      name="titre_publication"
                      value={formData.titre_publication}
                      onChange={handleChange}
                      placeholder="Donnez un titre à votre publication..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={etatsChargement.isCreating}
                    />
                  </div>

                  {/* Message */}
                  {!modeEdition ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Message actuel
                      </label>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {formData.message || 'Aucun message défini'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.message.length} caractères
                        {formData.message.length > 280 && (
                          <span className="text-orange-600 font-medium ml-2">
                            ⚠️ Message long pour X (280 caractères max)
                          </span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        maxLength={280}
                        placeholder="Rédigez votre message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className={`text-xs font-semibold ${
                          formData.message.length > 280 ? 'text-red-600' : 
                          formData.message.length > 250 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {formData.message.length} / 280
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Aperçu image */}
                  {contenuImageUrl && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Image incluse
                      </label>
                      <img 
                        src={contenuImageUrl} 
                        alt="Aperçu" 
                        className="max-h-32 object-contain mx-auto rounded"
                      />
                    </div>
                  )}

                  {/* Options publication */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-sm text-gray-900 flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Options de publication
                    </h4>
                    
                    <label className="flex items-center p-2.5 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={publicationImmediate}
                        onChange={(e) => {
                          setPublicationImmediate(e.target.checked);
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, date_programmee: '' }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded"
                        disabled={etatsChargement.isCreating}
                      />
                      <span className="ml-2 text-xs font-semibold text-gray-700">
                        🚀 Publier immédiatement
                      </span>
                    </label>

                    {!publicationImmediate && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          ⏰ Programmer
                        </label>
                        <input
                          type="datetime-local"
                          name="date_programmee"
                          value={formData.date_programmee}
                          onChange={handleChange}
                          min={minDateTime}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          disabled={etatsChargement.isCreating}
                        />
                        <p className="text-xs text-gray-500 mt-1 italic">
                          💡 Laissez vide pour créer un brouillon
                        </p>
                      </div>
                    )}

                    {!publicationImmediate && !formData.date_programmee && (
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <p className="text-xs text-yellow-900 font-medium">
                          📝 Sera enregistré en <strong>brouillon</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Aperçu */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h3 className="text-lg font-bold text-gray-900">
                  👁️ Aperçu
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Badge Plateforme */}
                  <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-xs font-bold text-blue-900">
                      Publication sur X (Twitter)
                    </span>
                  </div>

                  {/* Aperçu du tweet */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">Votre Compte X</p>
                        <p className="text-xs text-gray-500">@votre_handle</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-900 whitespace-pre-wrap break-words mb-3">
                      {formData.message || 'Votre message apparaîtra ici...'}
                    </p>
                    
                    {contenuImageUrl && (
                      <img
                        src={contenuImageUrl}
                        alt="Aperçu"
                        className="rounded-lg w-full object-cover max-h-48 border border-gray-200"
                      />
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-4 text-gray-500 text-xs">
                      <span>💬 0</span>
                      <span>🔁 0</span>
                      <span>❤️ 0</span>
                      <span>📊 0</span>
                      <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* Résumé des options */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-sm text-gray-900 mb-2">📋 Résumé</h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Plateforme:</span>
                        <span className="font-medium">{formData.plateforme.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Statut:</span>
                        <span className="font-medium">
                          {publicationImmediate ? '🚀 Publication immédiate' : 
                           formData.date_programmee ? '⏰ Programmé' : '📝 Brouillon'}
                        </span>
                      </div>
                      {formData.date_programmee && (
                        <div className="flex justify-between">
                          <span>Date programmée:</span>
                          <span className="font-medium">
                            {new Date(formData.date_programmee).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Caractères:</span>
                        <span className="font-medium">{formData.message.length}/280</span>
                      </div>
                      {contenuImageUrl && (
                        <div className="flex justify-between">
                          <span>Image:</span>
                          <span className="font-medium text-green-600">✓ Incluse</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm order-2 sm:order-1"
            disabled={etatsChargement.isCreating}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={etatsChargement.isCreating || !formData.message || !formData.titre_publication}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-bold flex items-center justify-center text-sm order-1 sm:order-2"
          >
            {etatsChargement.isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </>
            ) : publicationImmediate ? (
              '🚀 Publier maintenant'
            ) : formData.date_programmee ? (
              '⏰ Programmer'
            ) : (
              '📝 Créer brouillon'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}