'use client'
import { useContenu } from '@/hooks/useContenu';
import { useProjetById } from '@/hooks/useProjet';
import { useTemplateById } from '@/hooks/useTemplate';
import { usePublications } from '@/hooks/usePublication';
import { usePlateforme } from '@/hooks/usePlateforme';
import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { PublicationCreate, StatutPublicationEnum, Publication } from '@/types/publication';
import { useSearch } from '@/app/context/searchContext';
import { X as CloseIcon, Check, X as XIcon, Eye, Edit3, Calendar, Send } from 'lucide-react';
import { isValidImageUrlSync, SafeImage } from '@/app/utils/validation';

interface PublicationCreationModalProps {
  isOpen: boolean
  onClose: () => void
  contenuId: number
  contenuTitre?: string
  contenuTexte?: string
  contenuImageUrl?: string
  contenuType?: string
}

function PublicationCreationModal({ 
  isOpen, 
  onClose, 
  contenuId, 
  contenuTitre, 
  contenuTexte, 
  contenuImageUrl, 
  contenuType 
}: PublicationCreationModalProps) {
  const { actions, etatsChargement } = usePublications()
  const { plateformes, isLoading: isLoadingPlateformes } = usePlateforme()

  const [formData, setFormData] = useState({
    titre_publication: contenuTitre || '',
    message: contenuTexte || '',
    plateforme: 'x', // Par défaut X (Twitter)
    date_programmee: '',
  })

  const [publicationImmediate, setPublicationImmediate] = useState(false)
  const [modeEdition, setModeEdition] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({ show: false, message: '', type: 'success' })


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])


  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre_publication: contenuTitre || `Publication ${new Date().toLocaleDateString()}`,
        message: contenuTexte || '',
        plateforme: 'x',
        date_programmee: '',
      })
      setPublicationImmediate(false)
      setModeEdition(false)
      setNotification({ show: false, message: '', type: 'success' })
    }
  }, [isOpen, contenuTitre, contenuTexte])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' })
    }, 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.plateforme) {
      showNotification('Veuillez sélectionner une plateforme', 'error')
      return
    }

    // Validation de l'image avant soumission
    if (contenuImageUrl && !isValidImageUrlSync(contenuImageUrl)) {
      showNotification('L\'URL de l\'image n\'est pas valide', 'error')
      return
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
      }

      await actions.creer(publicationData)

      let message = ''
      if (publicationImmediate) {
        message = '✅ Publication créée et publiée avec succès sur X !'
      } else if (formData.date_programmee) {
        message = '⏰ Publication programmée avec succès !'
      } else {
        message = '📝 Brouillon créé avec succès !'
      }

      showNotification(message)

      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (error: any) {
      console.error('Erreur lors de la création:', error)
      showNotification(`❌ Erreur: ${error.message || 'Échec de la création'}`, 'error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const minDateTime = new Date().toISOString().slice(0, 16)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header du modal */}
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
              <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mx-4 sm:mx-6 mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              ) : (
                <XIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              )}
              <span className="font-semibold text-sm sm:text-base">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Contenu du modal */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Colonne de configuration */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ⚙️ Configuration
                </h3>

                {/* Sélecteur de plateforme */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Plateforme *
                  </label>
                  <select
                    name="plateforme"
                    value={formData.plateforme}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700 bg-white"
                    disabled={isLoadingPlateformes || etatsChargement.isCreating}
                  >
                    <option value="x">X (Twitter)</option>
                    {plateformes.map(plateforme => (
                      <option key={plateforme.id} value={plateforme.id}>
                        {plateforme.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bouton d'édition */}
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
                  {/* Titre de la publication */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Titre de la publication *
                    </label>
                    <input
                      type="text"
                      name="titre_publication"
                      value={formData.titre_publication}
                      onChange={handleChange}
                      required
                      placeholder="Donnez un titre à votre publication..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
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
                        required
                        rows={6}
                        placeholder="Rédigez votre message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        maxLength={280}
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

                  {/* Aperçu de l'image si disponible */}
                  {contenuImageUrl && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Image incluse
                      </label>
                      {isValidImageUrlSync(contenuImageUrl) ? (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <SafeImage
                            src={contenuImageUrl} 
                            alt="Aperçu" 
                            className="max-h-32 object-contain mx-auto rounded"
                            width={300}
                            height={200}
                          />
                          <p className="text-xs text-gray-500 text-center mt-2">
                            Cette image sera jointe à la publication
                          </p>
                        </div>
                      ) : (
                        <div className='border border-yellow-200 rounded-lg p-3 bg-yellow-50'>
                          <p className='text-sm text-yellow-700 text-center'>⚠️ URL d'image invalide</p>
                          <p className="text-xs text-yellow-600 text-center truncate">{contenuImageUrl}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Options de publication */}
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
                          setPublicationImmediate(e.target.checked)
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, date_programmee: '' }))
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
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

            {/* Colonne d'aperçu */}
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
                    
                    {contenuImageUrl && isValidImageUrlSync(contenuImageUrl) && (
                      <SafeImage
                        src={contenuImageUrl}
                        alt="Aperçu"
                        className="rounded-lg w-full object-cover max-h-48 border border-gray-200"
                        width={400}
                        height={200}
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
                          <span className={`font-medium ${
                            isValidImageUrlSync(contenuImageUrl) ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isValidImageUrlSync(contenuImageUrl) ? '✓ Incluse' : '✗ Invalide'}
                          </span>
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
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1"
            disabled={etatsChargement.isCreating}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={etatsChargement.isCreating || !formData.message || !formData.titre_publication || (contenuImageUrl && !isValidImageUrlSync(contenuImageUrl))}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center text-sm order-1 sm:order-2"
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
  )
}

function ContenuCard({ contenu, onDelete, searchQuery, publicationCount, recentPublications }: { 
  contenu: any; 
  onDelete: () => void;
  searchQuery: string;
  publicationCount: number;
  recentPublications: Publication[];
}) {
  const { data: projet } = useProjetById(contenu.id_projet || null);
  const { data: template } = useTemplateById(contenu.id_template || null);

  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);

  const HighlightText = ({ text, searchQuery }: { text: string; searchQuery: string }) => {
    if (!searchQuery.trim() || !text) return <>{text}</>;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <Link href={`/contenu/${contenu.id}`} className="cursor-pointer block flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
              {/* Mise en évidence du titre */}
              {searchQuery && contenu.titre ? (
                <HighlightText text={contenu.titre} searchQuery={searchQuery} />
              ) : (
                contenu.titre ?? '(Sans titre)'
              )}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{contenu.id}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-sm text-gray-500">
              {new Date(contenu.date_creation).toLocaleString()} • 
              <span className={`capitalize ml-1 px-2 py-1 rounded text-xs ${
                contenu.type_contenu === 'text' ? 'bg-blue-100 text-blue-800' :
                contenu.type_contenu === 'image' ? 'bg-orange-100 text-orange-800' :
                contenu.type_contenu === 'multimodal' ? 'bg-purple-100 text-purple-800' :
                contenu.type_contenu === 'video' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {contenu.type_contenu}
                {contenu.type_contenu === 'multimodal' && ' 📷'}
              </span>
            </div>

            {/* Statistiques de publication */}
            {publicationCount > 0 && (
              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="font-medium">{publicationCount} publication(s)</span>
                {recentPublications.length > 0 && (
                  <span className="ml-1 text-gray-500">
                    • Dernière: {new Date(recentPublications[0].date_creation).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center text-xs text-gray-600">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Projet: 
              <span className="font-medium ml-1 flex items-center">
                {projet?.nom_projet || 'Défaut'}
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Personnel
                </span>
              </span>
            </div>

            {template && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Template: <span className="font-medium ml-1">
                  {template.nom_template}
                </span>
              </div>
            )}

            {contenu.meta?.has_images && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {contenu.meta.image_count || 1} image(s) utilisée(s)
              </div>
            )}
          </div>
          
          {/* Affichage du contenu avec mise en évidence */}
          {contenu.type_contenu === 'text' && contenu.texte && (
            <p className="text-gray-700 line-clamp-4 text-sm leading-relaxed">
              {searchQuery ? (
                <HighlightText text={contenu.texte} searchQuery={searchQuery} />
              ) : (
                contenu.texte
              )}
            </p>
          )}
          {contenu.type_contenu === 'image' && contenu.image_url && 
          isValidImageUrlSync(contenu.image_url) && (
            <SafeImage
              src={contenu.image_url} 
              alt={contenu.titre ?? ''} 
              className="mt-2 rounded-lg max-h-48 w-full object-cover hover:opacity-90 transition-opacity border border-gray-200"
              width={400}
              height={200}
            />
          )}
          {contenu.type_contenu === 'multimodal' && contenu.contenu_structure && (
            <div className="mt-2 p-3 bg-gray-50 rounded border">
              <p className="text-sm text-gray-600">
                📄 Contenu multimodal généré
                {contenu.meta?.image_count && ` • ${contenu.meta.image_count} image(s) analysée(s)`}
              </p>
            </div>
          )}
        </div>
      </Link>
          
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-2">
        {/* Lien Voir */}
        <Link
          href={`/contenu/${contenu.id}`}
          className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center flex-shrink-0 min-w-0"
        >
          <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">Voir</span>
        </Link>

        {/* Groupe de boutons */}
        <div className="flex items-center gap-1 flex-shrink-0 min-w-0">
          <button
            onClick={() => setIsPublicationModalOpen(true)}
            className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center bg-green-50 px-2 py-1 rounded hover:bg-green-100 transition-colors flex-shrink-0"
            title="Publier"
          >
            <Send className="w-3 h-3" />
          </button>

          <Link
            href={`/generer/${contenu.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center p-1 rounded hover:bg-blue-50 transition-colors flex-shrink-0"
            title="Éditer"
          >
            <Edit3 className="w-3 h-3" />
          </Link>

          <button
            className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
            onClick={onDelete}
            title="Supprimer"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nouveau Modal de publication */}
      <PublicationCreationModal
        isOpen={isPublicationModalOpen}
        onClose={() => setIsPublicationModalOpen(false)}
        contenuId={contenu.id}
        contenuTitre={contenu.titre}
        contenuTexte={contenu.texte || undefined}
        contenuImageUrl={contenu.image_url || undefined}
        contenuType={contenu.type_contenu}
      />
    </div>
  );
}

export default function HistoriqueContenuPage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();
  const { utilisateur } = useCurrentUtilisateur();
  const { searchQuery } = useSearch();
  const { publications, statistiques } = usePublications();
  const [contenuToDelete, setContenuToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const userContenus = contenus.filter(contenu => {
    return contenu.id_utilisateur === utilisateur?.id;
  });

  // Compter les publications par contenu
  const getPublicationCountForContenu = (contenuId: number) => {
    return publications.filter(pub => pub.id_contenu === contenuId).length;
  };

  // Obtenir les publications récentes pour un contenu
  const getRecentPublicationsForContenu = (contenuId: number) => {
    return publications
      .filter(pub => pub.id_contenu === contenuId)
      .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
      .slice(0, 3); // 3 publications max
  };

  const filterContenus = (contenus: any[], query: string) => {
    if (!query.trim()) return contenus;

    const lowerQuery = query.toLowerCase();
    return contenus.filter(contenu =>
      contenu.titre?.toLowerCase().includes(lowerQuery) ||
      contenu.texte?.toLowerCase().includes(lowerQuery) ||
      contenu.type_contenu?.toLowerCase().includes(lowerQuery) ||
      contenu.date_creation?.toLowerCase().includes(lowerQuery) ||
      (contenu.meta && JSON.stringify(contenu.meta).toLowerCase().includes(lowerQuery))
    );
  };

  const filteredContenus = filterContenus(userContenus, searchQuery);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const closeNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  const confirmDelete = async () => {
    if (contenuToDelete === null) return;
    
    try {
      await deleteContenu(contenuToDelete);
      showNotification('Contenu supprimé avec succès', 'success');
    } catch (err) {
      showNotification('Erreur lors de la suppression', 'error');
    } finally {
      setContenuToDelete(null);
    }
  };

  const cancelDelete = () => {
    setContenuToDelete(null);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-900">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white min-h-screen">
        <div className="text-red-600 text-center">Une erreur est survenue : {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        } rounded-lg shadow-lg p-4 animate-fade-in`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={closeNotification}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {contenuToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historique des contenus</h1>
            
            <div className="mt-2 flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">
                Vos contenus personnels - Confidentialité totale
              </span>
            </div>

            {searchQuery && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>
                  Recherche: `<strong>{searchQuery}</strong>`
                  ({filteredContenus.length} résultat{filteredContenus.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {filteredContenus.length} contenu{filteredContenus.length > 1 ? 's' : ''}
          </div>
        </div>

        {filteredContenus.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">
              {searchQuery ? "🔍" : "📄"}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "Aucun contenu trouvé" : "Aucun contenu personnel"}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `Aucun de vos contenus ne correspond à "${searchQuery}". Essayez d'autres termes.`
                : "Vous n'avez pas encore créé de contenu. Créez-en un pour commencer !"
              }
            </p>
            {!searchQuery && (
              <Link
                href="/generer"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Créer votre premier contenu
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContenus.map((c: any) => (
              <ContenuCard 
                key={c.id} 
                contenu={c} 
                onDelete={() => setContenuToDelete(c.id)}
                searchQuery={searchQuery}
                publicationCount={getPublicationCountForContenu(c.id)}
                recentPublications={getRecentPublicationsForContenu(c.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}