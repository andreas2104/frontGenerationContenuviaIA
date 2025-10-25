'use client'

import { useState, useMemo, useEffect } from 'react'
import { useContenu } from '@/hooks/useContenu'
import { usePublications } from '@/hooks/usePublication'
import { PublicationCreate, StatutPublicationEnum } from '@/types/publication'
import { Contenu } from '@/types/contenu'
import { X as CloseIcon, Search, Check, X as XIcon, ChevronLeft } from 'lucide-react'

type FilterType = 'all' | 'image' | 'video' | 'texte'

interface PublicationCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PublicationCreationModal({ isOpen, onClose }: PublicationCreationModalProps) {
  const { contenus, isPending: isLoadingContenus } = useContenu()
  const { actions, etatsChargement } = usePublications()

  const [selectedContenu, setSelectedContenu] = useState<Contenu | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [modeEdition, setModeEdition] = useState(false)
  const [currentView, setCurrentView] = useState<'selection' | 'configuration'>('selection')
  const [isMobile, setIsMobile] = useState(false)

  const [formData, setFormData] = useState({
    message: '',
    date_programmee: '',
  })

  const [publicationImmediate, setPublicationImmediate] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({ show: false, message: '', type: 'success' })

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Réinitialiser le modal à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setSelectedContenu(null)
      setFilterType('all')
      setSearchQuery('')
      setShowPreview(false)
      setModeEdition(false)
      setCurrentView('selection')
      setFormData({ message: '', date_programmee: '' })
      setPublicationImmediate(false)
      setNotification({ show: false, message: '', type: 'success' })
    }
  }, [isOpen])

  // Filtrer les contenus
  const contenusFiltered = useMemo(() => {
    let filtered = contenus || []

    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type_contenu === filterType)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.titre?.toLowerCase().includes(query) ||
        c.texte?.toLowerCase().includes(query) ||
        c.hashtags?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [contenus, filterType, searchQuery])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' })
    }, 4000)
  }

  const handleSelectContenu = (contenu: Contenu) => {
    setSelectedContenu(contenu)
    setFormData({
      message: contenu.texte || contenu.titre || '',
      date_programmee: '',
    })
    setModeEdition(false)
    setShowPreview(true)
    
    // Sur mobile, passer à la vue configuration après sélection
    if (isMobile) {
      setCurrentView('configuration')
    }
  }

  const handleBackToSelection = () => {
    setCurrentView('selection')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedContenu) {
      showNotification('Veuillez sélectionner un contenu', 'error')
      return
    }

    try {
      const publicationData: PublicationCreate = {
        id_contenu: selectedContenu.id,
        message: formData.message,
        titre_publication: selectedContenu.titre || `Publication X - ${new Date().toLocaleDateString()}`,
        image_url: selectedContenu.image_url,
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

  const minDateTime = new Date().toISOString().slice(0, 16)

  if (!isOpen) return null

  // Vue de sélection des contenus
  const SelectionView = () => (
    <div className={`${isMobile ? (currentView === 'selection' ? 'block' : 'hidden') : 'lg:block'} bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col`}>
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            📚 Bibliothèque de contenus
          </h3>
          <span className="px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
            {contenusFiltered.length} contenu{contenusFiltered.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un contenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Tous', icon: '📋', count: contenus?.length || 0 },
            { value: 'image', label: 'Images', icon: '🖼️', count: contenus?.filter(c => c.type_contenu === 'image').length || 0 },
            { value: 'video', label: 'Vidéos', icon: '🎥', count: contenus?.filter(c => c.type_contenu === 'video').length || 0 },
            { value: 'texte', label: 'Textes', icon: '📝', count: contenus?.filter(c => c.type_contenu === 'texte').length || 0 },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as FilterType)}
              type="button"
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === filter.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="text-xs sm:text-sm">{filter.icon}</span>
              <span className="hidden xs:inline">{filter.label}</span>
              <span className={`text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${
                filterType === filter.value ? 'bg-blue-500' : 'bg-gray-200'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste des contenus */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {isLoadingContenus ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">Chargement...</p>
          </div>
        ) : contenusFiltered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Aucun contenu trouvé</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Ajustez vos filtres</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2">
            {contenusFiltered.map((contenu) => (
              <div
                key={contenu.id}
                onClick={() => handleSelectContenu(contenu)}
                className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedContenu?.id === contenu.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  {contenu.image_url ? (
                    <div className="relative flex-shrink-0">
                      <img
                        src={contenu.image_url}
                        alt={contenu.titre}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                      />
                      {selectedContenu?.id === contenu.id && (
                        <div className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl">📄</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {contenu.titre || 'Sans titre'}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      {contenu.texte}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {contenu.type_contenu}
                      </span>
                      {contenu.est_publie && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                          ✓ Publié
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Vue de configuration
  const ConfigurationView = () => (
    <div className={`${isMobile ? (currentView === 'configuration' ? 'block' : 'hidden') : 'lg:block'} bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col`}>
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={handleBackToSelection}
                className="p-1 sm:p-2 rounded-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            )}
            <h3 className="text-lg font-bold text-gray-900">
              {showPreview ? '👁️ Aperçu' : '📝 Configuration'}
            </h3>
          </div>
          {selectedContenu && (
            <button
              type="button"
              onClick={() => setModeEdition(!modeEdition)}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors shadow-sm border border-blue-200"
            >
              {modeEdition ? '👁️ Aperçu' : '✏️ Personnaliser'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {!showPreview ? (
          <div className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[300px]">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold mb-2 text-sm sm:text-base">Sélectionnez un contenu</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Choisissez un contenu pour voir l'aperçu
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-4">
            {/* Badge Plateforme */}
            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-xs font-bold text-blue-900">
                Publication sur X (Twitter)
              </span>
            </div>

            {/* Aperçu ou édition */}
            {!modeEdition ? (
              <div className="p-3 sm:p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-2 sm:gap-2 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">Votre Compte X</p>
                    <p className="text-xs text-gray-500">@votre_handle</p>
                  </div>
                </div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap break-words mb-3">
                  {formData.message}
                </p>
                {selectedContenu?.image_url && (
                  <img
                    src={selectedContenu.image_url}
                    alt="Aperçu"
                    className="rounded-lg w-full object-cover max-h-48 sm:max-h-64 border border-gray-200"
                  />
                )}
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3 sm:gap-4 text-gray-500 text-xs">
                  <span>💬 0</span>
                  <span>🔁 0</span>
                  <span>❤️ 0</span>
                  <span>📊 0</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Message du tweet *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={isMobile ? 4 : 5}
                    placeholder="Modifiez votre message..."
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

                {selectedContenu?.image_url && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Image jointe
                    </label>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <img
                        src={selectedContenu.image_url}
                        alt="Aperçu"
                        className="max-h-32 sm:max-h-32 object-contain mx-auto rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-sm text-gray-900">⚙️ Options</h4>

              <label className="flex items-center p-2 sm:p-2.5 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
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
                />
                <span className="ml-2 text-xs font-semibold text-gray-700">
                  🚀 Publier immédiatement
                </span>
              </label>

              {!publicationImmediate && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ⏰ Programmer
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date_programmee}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_programmee: e.target.value }))}
                    min={minDateTime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1 italic">
                    💡 Laissez vide pour créer un brouillon
                  </p>
                </div>
              )}

              {!publicationImmediate && !formData.date_programmee && (
                <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-xs text-yellow-900 font-medium">
                    📝 Sera enregistré en <strong>brouillon</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header du modal */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Nouvelle Publication</h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Publiez votre contenu sur X (Twitter)</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
              Étape {showPreview ? '2/2' : '1/2'}
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
          <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-2'} gap-3 sm:gap-6 h-full`}>
            <SelectionView />
            <ConfigurationView />
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
            disabled={etatsChargement.isCreating || !formData.message || !selectedContenu}
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