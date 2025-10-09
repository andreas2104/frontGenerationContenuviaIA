'use client'

import { useState, useEffect } from 'react'
import { usePublications } from '@/hooks/usePublication'
import { usePlateforme } from '@/hooks/usePlateforme'
import { PublicationCreate, StatutPublicationEnum } from '@/types/publication'

interface PublicationModalProps {
  isOpen: boolean
  onClose: () => void
  contenuId: number
  contenuTitre?: string
  contenuTexte?: string
  contenuImageUrl?: string
  contenuType?: string
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
  const { actions, etatsChargement } = usePublications()
  const { plateformes, isLoading: isLoadingPlateformes } = usePlateforme()
  console.log('ireo plateforme', plateformes);
  console.log('🔍 [DEBUG] Plateformes chargées:', {
  count: plateformes.length,
  data: plateformes,
  isLoading: isLoadingPlateformes,
  hasData: plateformes && plateformes.length > 0
});
  const [formData, setFormData] = useState({
    titre_publication: contenuTitre || '',
    message: contenuTexte || '',
    id_plateforme: '',
    date_programmee: '',
    statut: StatutPublicationEnum.brouillon
  })

  const [publicationImmediate, setPublicationImmediate] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' })

  // Réinitialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre_publication: contenuTitre || '',
        message: contenuTexte || '',
        id_plateforme: '',
        date_programmee: '',
        statut: StatutPublicationEnum.brouillon
      })
      setPublicationImmediate(false)
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
    
    if (!formData.id_plateforme) {
      showNotification('Veuillez sélectionner une plateforme', 'error')
      return
    }

    try {
      const publicationData: PublicationCreate = {
        id_contenu: contenuId,
        id_plateforme: parseInt(formData.id_plateforme),
        titre_publication: formData.titre_publication,
        statut: publicationImmediate ? StatutPublicationEnum.programme : formData.statut,
        date_programmee: publicationImmediate ? new Date().toISOString() : (formData.date_programmee || undefined),
        parametres_publication: {
          message: formData.message,
          image_url: contenuImageUrl,
          contenu_type: contenuType,
          created_from: 'modal'
        }
      }

      const result = await actions.creer(publicationData)
      const createdPublication = result.publication
      
      // Si publication immédiate demandée
      if (publicationImmediate && createdPublication?.id) {
        try {
          await actions.publier(createdPublication.id)
          showNotification('Publication créée et publiée avec succès !')
        } catch (publishError) {
          showNotification('Publication créée mais erreur lors de la publication', 'error')
        }
      } else {
        showNotification('Publication créée avec succès !')
      }

      // Fermer la modal après un délai
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (error: any) {
      console.error('Erreur lors de la création:', error)
      showNotification(`Erreur: ${error.message || 'Échec de la création'}`, 'error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Calculer la date minimale (maintenant)
  const minDateTime = new Date().toISOString().slice(0, 16)

  if (!isOpen) return null

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
              <option value="" className='bg-white text-gray-900'>Sélectionnez une plateforme</option>
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
  )
}