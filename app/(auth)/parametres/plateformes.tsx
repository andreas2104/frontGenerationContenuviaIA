// pages/parametres/plateformes.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ParametresPlateformes = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Gérer les paramètres d'URL après retour OAuth
    const { success, error, platform, message } = router.query;

    if (success === 'true') {
      setNotification({
        type: 'success',
        message: `Connexion à ${platform} réussie !`
      });
      // Nettoyer l'URL
      router.replace('/parametres/plateformes', undefined, { shallow: true });
    }

    if (error) {
      let errorMessage = 'Erreur lors de la connexion';
      
      switch (error) {
        case 'oauth_failed':
          errorMessage = `Échec de la connexion à ${platform}`;
          break;
        case 'server_error':
          errorMessage = `Erreur serveur: ${message}`;
          break;
        case 'access_denied':
          errorMessage = 'Vous avez refusé l\'autorisation';
          break;
        default:
          errorMessage = `Erreur: ${error}`;
      }

      setNotification({
        type: 'error',
        message: errorMessage
      });
      
      router.replace('/parametres/plateformes', undefined, { shallow: true });
    }
  }, [router.query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes plateformes connectées</h1>
      
      {/* Notification */}
      {notification && (
        <div className={`p-4 mb-6 rounded ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Contenu de la page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vos composants de plateformes ici */}
      </div>
    </div>
  );
};

export default ParametresPlateformes;