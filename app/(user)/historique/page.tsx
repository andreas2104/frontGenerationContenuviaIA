'use client'
import { useContenu } from '@/hooks/useContenu';

export default function HistoriqueContenuPage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">Une erreur est survenue : {error.message}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Historique des contenus</h1>
        </div>

        {contenus.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">
            Aucun contenu trouvé. Créez-en un pour commencer !
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contenus.map(c => (
              <div
                key={c.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {c.titre ?? '(Sans titre)'}
                  </h2>
                  <div className="text-sm text-gray-500 mb-4">
                    #{c.id} • {new Date(c.date_creation).toLocaleString()} • {c.type_contenu}
                  </div>
                  {c.type_contenu === 'text' && c.texte && (
                    <p className="text-gray-600 mb-4 line-clamp-4">{c.texte}</p>
                  )}
                  {c.type_contenu === 'image' && c.image_url && (
                    <img src={c.image_url} alt={c.titre ?? ''} className="mt-2 rounded max-h-48 w-full object-cover" />
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  {/* À brancher si tu as une page d’édition */}
                  <a
                    className="text-blue-500 hover:text-blue-700 font-medium"
                    href={`/contenu/${c.id}`}
                  >
                    Éditer
                  </a>
                  <button
                    className="text-red-500 hover:text-red-700 font-medium"
                    onClick={() => deleteContenu(c.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}