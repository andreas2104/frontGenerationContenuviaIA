// pages/oauth/redirect.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/router';
import { Loader2, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

export default function OAuthRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const authUrl = searchParams.get('auth_url');
  const platform = localStorage.getItem('oauth_platform') || 'la plateforme';

  useEffect(() => {
    const initiateOAuthRedirect = async () => {
      if (!authUrl) {
        setStatus('error');
        setErrorMessage('URL d\'autorisation manquante');
        return;
      }

      try {
        setStatus('redirecting');
        
        // Attendre un peu pour que l'utilisateur voie le message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirection vers le provider OAuth
        window.location.href = authUrl;
        
      } catch (error) {
        setStatus('error');
        setErrorMessage('Erreur lors de la redirection');
        console.error('Erreur OAuth:', error);
      }
    };

    initiateOAuthRedirect();
  }, [authUrl]);

  const handleCancel = () => {
    const errorUrl = localStorage.getItem('oauth_error_url') || '/parametres/plateformes?error=cancelled';
    router.push(errorUrl);
  };

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de connexion</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={handleCancel}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retour aux paramètres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        {status === 'loading' ? (
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        ) : (
          <ExternalLink className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        )}
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'loading' ? 'Préparation de la connexion' : 'Redirection en cours'}
        </h1>
        
        <p className="text-gray-600 mb-4">
          {status === 'loading' 
            ? `Initialisation de la connexion avec ${platform}...`
            : `Vous allez être redirigé vers ${platform} pour autoriser l'accès.`
          }
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Connexion sécurisée via OAuth 2.0</span>
          </div>
        </div>

        {status === 'loading' && (
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}