'use client';
import { Send } from 'lucide-react';

interface ContenuResultProps {
  result: any;
  onPublish: () => void;
  onRegenerate: () => void;
  canRegenerate: boolean;
  isRegenerating: boolean;
  utilisateur: any;
  isAdmin: boolean;
}

export default function ContenuResult({
  result,
  onPublish,
  onRegenerate,
  canRegenerate,
  isRegenerating,
  utilisateur,
  isAdmin
}: ContenuResultProps) {
  
  // État vide - Aucun contenu généré
  if (!result) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Résultat</h2>
        
        <div className="text-gray-500 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <div className="space-y-3">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600">Le contenu généré apparaîtra ici</p>
            <p className="text-sm text-gray-500">Sélectionnez un projet, un modèle et un prompt pour commencer</p>
          </div>
        </div>
      </section>
    );
  }

  // Affichage du résultat
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Résultat</h2>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        
        {/* Header du résultat avec badge type */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
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
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onRegenerate}
              disabled={!canRegenerate || isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </>
              ) : (
                '🔄 Régénérer'
              )}
            </button>
          </div>
        </div>

        {/* Contenu généré selon le type */}
        <div className="p-4">
          {/* TYPE: IMAGE */}
          {result.type === 'image' && result.image_url ? (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <img
                  src={result.image_url}
                  alt="Contenu généré" 
                  className="max-w-full h-auto rounded border border-gray-300 shadow-sm mx-auto"
                />
              </div>
              {result.contenu && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Description:</strong> {result.contenu}
                  </p>
                </div>
              )}
            </div>
          ) : result.type === 'multimodal' ? (
            /* TYPE: MULTIMODAL */
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Analyse multimodale
                </h3>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-white p-3 rounded-lg border border-purple-100 overflow-auto max-h-96 text-gray-800 shadow-inner">
                  {result.contenu}
                </pre>
              </div>
              
              {result.structure && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Structure détaillée
                  </h4>
                  <pre className="text-xs text-gray-600 bg-white p-3 rounded border border-gray-200 overflow-auto max-h-48 font-mono">
                    {JSON.stringify(result.structure, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* TYPE: TEXT */
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 overflow-auto max-h-96">
                  {result.contenu}
                </pre>
              </div>
              <div className="flex items-center justify-between text-sm px-2 text-gray-700">
                <span>📝 {result.contenu?.length || 0} caractères</span>
                {result.titre && (
                  <span className="text-gray-600 font-medium">
                    Titre: {result.titre}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions du résultat */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            
            {/* Actions principales */}
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => {
                  navigator.clipboard.writeText(result.contenu || '');
                  // Optionnel: ajouter une notification de succès
                }}
                title="Copier le contenu"
              >
                📋 Copier
              </button>
              
              <button
                className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50 transition-colors shadow-sm"
                onClick={onPublish}
                title="Publier sur les réseaux sociaux"
              >
                <Send className="w-4 h-4 mr-1" />
                Publier
              </button>
            </div>
            
            {/* Actions secondaires */}
            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                href="/contenus"
              >
                📚 Mes contenus
              </a>
              
              {result.type === 'text' && (
                <button
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={() => {
                    // TODO: Implémenter la sauvegarde comme prompt
                    console.log('Sauvegarder comme prompt:', result.contenu);
                  }}
                  title="Sauvegarder ce contenu comme nouveau prompt"
                >
                  💾 Sauver comme prompt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informations utilisateur en bas */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 flex items-center justify-between flex-wrap gap-2">
          <span>
            👤 Connecté en tant que <strong>{utilisateur?.nom || 'Utilisateur'}</strong>
            {isAdmin && (
              <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-900 rounded text-xs font-medium">
                Admin
              </span>
            )}
          </span>
          {/* {result.id && (
            <span className="text-xs text-blue-600">
              ID: #{result.id}
            </span>
          )} */}
        </p>
      </div>
    </section>
  );
}