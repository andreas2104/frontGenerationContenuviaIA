'use client'
import { useContenu } from '@/hooks/useContenu';

export default function HistoriqueContenuPage() {
  const { contenus, isPending, error, deleteContenu } = useContenu();
  //  {isPending && <div className="animate-pulse h-24 rounded bg-gray-200" />}

  if (isPending) return <div className="animate-pulse h-24 ronded bg-amber-200">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">{error.message}</div>;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Historique</h1>
        {isPending && <div className="animate-pulse h-24 rounded bg-gray-200" />}
      <div className="grid gap-3">
        {contenus.map(c => (
          <div key={c.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{c.titre ?? '(Sans titre)'}</div>
                <div className="text-sm text-gray-500">
                  #{c     .id} • {new Date(c.date_creation).toLocaleString()} • {c.type_contenu}
                </div>
              </div>
              <div className="flex gap-2">
                {/* À brancher si tu as une page d’édition */}
                <a className="border rounded px-3 py-1" href={`/contenu/${c.id}`}>Éditer</a>
                <button
                  className="border rounded px-3 py-1"
                  onClick={() => deleteContenu(c.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>

            {c.type_contenu === 'text' && c.texte && (
              <p className="mt-2 text-sm text-gray-700 line-clamp-3">{c.texte}</p>
            )}
            {c.type_contenu === 'image' && c.image_url && (
              <img src={c.image_url} alt={c.titre ?? ''} className="mt-2 rounded max-h-72 object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
