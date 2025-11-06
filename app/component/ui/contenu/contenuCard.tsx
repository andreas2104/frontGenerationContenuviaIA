'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useProjetById } from '@/hooks/useProjet';
import { useTemplateById } from '@/hooks/useTemplate';
import { Publication } from '@/types/publication';
import { isValidImageUrlSync, SafeImage } from '@/app/utils/validation';
import { Eye, Edit3, Send } from 'lucide-react';
import PublicationCreationModal from '../publication/publicationInputModal';
// import { PublicationCreationModal } from './publicationInputModal';

interface ContenuCardProps {
  contenu: any;
  onDelete: () => void;
  searchQuery: string;
  publicationCount: number;
  recentPublications: Publication[];
}

function HighlightText({ text, searchQuery }: { text: string; searchQuery: string }) {
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
}

export function ContenuCard({ contenu, onDelete, searchQuery, publicationCount, recentPublications }: ContenuCardProps) {
  const { data: projet } = useProjetById(contenu.id_projet || null);
  const { data: template } = useTemplateById(contenu.id_template || null);
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <Link href={`/contenu/${contenu.id}`} className="cursor-pointer block flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
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
          <img
            src= {contenu?.image_url}/>
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