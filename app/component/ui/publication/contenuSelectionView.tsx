'use client'

import { Contenu } from '@/types/contenu'
import { Search, Check } from 'lucide-react'

type FilterType = 'all' | 'image' | 'video' | 'texte'

interface ContenuSelectionViewProps {
  contenus: Contenu[] | undefined
  isLoadingContenus: boolean
  filterType: FilterType
  setFilterType: (type: FilterType) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedContenu: Contenu | null
  onSelectContenu: (contenu: Contenu) => void
  isMobile: boolean
  currentView: 'selection' | 'configuration'
}

export default function ContenuSelectionView({
  contenus,
  isLoadingContenus,
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery,
  selectedContenu,
  onSelectContenu,
  isMobile,
  currentView
}: ContenuSelectionViewProps) {

  const contenusFiltered = contenus?.filter(contenu => {
    if (filterType !== 'all' && contenu.type_contenu !== filterType) {
      return false
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        contenu.titre?.toLowerCase().includes(query) ||
        contenu.texte?.toLowerCase().includes(query)
      )
    }
    
    return true
  }) || []

  const filterCounts = {
    all: contenus?.length || 0,
    image: contenus?.filter(c => c.type_contenu === 'image').length || 0,
    video: contenus?.filter(c => c.type_contenu === 'video').length || 0,
    texte: contenus?.filter(c => c.type_contenu === 'texte').length || 0,
  }

  return (
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

        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Tous', icon: '📋', count: filterCounts.all },
            { value: 'image', label: 'Images', icon: '🖼️', count: filterCounts.image },
            { value: 'video', label: 'Vidéos', icon: '🎥', count: filterCounts.video },
            { value: 'texte', label: 'Textes', icon: '📝', count: filterCounts.texte },
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
                onClick={() => onSelectContenu(contenu)}
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
}