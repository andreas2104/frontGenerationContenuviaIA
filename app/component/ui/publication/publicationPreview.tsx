'use client'

import { useState } from 'react'
import { Contenu } from '@/types/contenu'
import { ChevronLeft } from 'lucide-react'

interface PublicationPreviewProps {
  selectedContenu: Contenu | null
  formData: {
    message: string
    date_programmee: string
  }
  setFormData: (data: { message: string; date_programmee: string }) => void
  modeEdition: boolean
  setModeEdition: (mode: boolean) => void
  publicationImmediate: boolean
  setPublicationImmediate: (immediate: boolean) => void
  showPreview: boolean
  minDateTime: string
  isMobile: boolean
  currentView: 'selection' | 'configuration'
  onBackToSelection: () => void
}

export default function PublicationPreview({
  selectedContenu,
  formData,
  setFormData,
  modeEdition,
  setModeEdition,
  publicationImmediate,
  setPublicationImmediate,
  showPreview,
  minDateTime,
  isMobile,
  currentView,
  onBackToSelection
}: PublicationPreviewProps) {

  const convertToUTC = (localDateString: string): string => {
    if (!localDateString) return '';
    const localDate = new Date(localDateString);
    return localDate.toISOString();
  }

  return (
    <div className={`${isMobile ? (currentView === 'configuration' ? 'block' : 'hidden') : 'lg:block'} bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col`}>
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={onBackToSelection}
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
                Choisissez un contenu pour voir l&apos;aperçu
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-xs font-bold text-blue-900">
                Publication sur X (Twitter)
              </span>
            </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1 italic">
                    💡 Laissez vide pour créer un brouillon
                  </p>
                  
                  {formData.date_programmee && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium">
                        🌍 Publication prévue à :
                      </p>
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">
                        {new Date(formData.date_programmee).toLocaleString('fr-FR', {
                          dateStyle: 'full',
                          timeStyle: 'short'
                        })} (votre heure locale)
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        = {new Date(convertToUTC(formData.date_programmee)).toLocaleString('fr-FR', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                          timeZone: 'UTC'
                        })} UTC
                      </p>
                    </div>
                  )}
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
}