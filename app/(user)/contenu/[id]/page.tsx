'use client'

import { useParams } from 'next/navigation'
import { useContenuById } from "@/hooks/useContenu"
import Link from 'next/link'

export default function ContenuDetailPage() {
  const params = useParams()
  const id = params.id ? parseInt(params.id as string) : undefined
  
  const { contenu, isPending, error } = useContenuById(id)

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement....</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 text-center">
        Une erreur est survenue: {error.message}
      </div>
    )
  }

  if (!contenu) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-500 text-lg mt-12">Contenu non trouvé.</div>
        <Link 
          href="/historique" 
          className="mt-4 inline-block text-blue-500 hover:text-blue-700"
        >
          Retour à l'historique
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Détails du contenu</h1>
          <Link 
            href="/contenu"
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Retour à l'historique
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {contenu.titre ?? '(Sans titre)'}
              </h2>
              <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-4">
                {/* <span>#{contenu.id}</span> */}
                <span>Créé le : {new Date(contenu.date_creation).toLocaleString()}</span>
                <span className="capitalize bg-gray-200 px-2 py-1 rounded">
                  {contenu.type_contenu}
                </span>
              </div>
            </div>

            <div className="mb-6">
              {contenu.type_contenu === 'text' && contenu.texte && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {contenu.texte}
                  </p>
                </div>
              )}
              
              {contenu.type_contenu === 'image' && contenu.image_url && (
                <div className="flex justify-center">
                  <img 
                    src={contenu?.image_url} 
                    alt={contenu.titre ?? 'Image'} 
                    className="rounded-lg max-w-full h-auto max-h-96 object-contain border"
                  />
                </div>
              )}
            </div>
          
            {/* Section métadonnées si elles existent */}
            {contenu.meta && Object.keys(contenu.meta).length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Métadonnées</h3>
                <pre className="text-gray-600 text-sm whitespace-pre-wrap">
                  {JSON.stringify(contenu.meta, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Link
                href={`/generer/${contenu.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
              >
                Éditer
              </Link>
              <Link
                href="/contenu"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Retour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}