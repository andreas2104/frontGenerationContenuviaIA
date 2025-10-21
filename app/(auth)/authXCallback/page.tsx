// pages/authXCallback.js
'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthXCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                console.log('=== DÉBUT TRAITEMENT CALLBACK X ===');
                console.log('URL complète:', window.location.href);

                // Récupérer les paramètres de l'URL
                const token = searchParams.get('token');
                const errorParam = searchParams.get('error');

                console.log('Token présent:', !!token);
                console.log('Erreur présente:', errorParam);

                // Vérifier s'il y a une erreur
                if (errorParam) {
                    const errorMessages: { [key: string]: string } = {
                        'invalid_state': 'La validation de sécurité a échoué. Veuillez réessayer.',
                        'pkce_error': 'Erreur de sécurité PKCE. Veuillez réessayer.',
                        'token_exchange_failed': 'L\'échange de token a échoué.',
                        'no_token': 'Aucun token reçu.',
                        'user_info_failed': 'Impossible de récupérer les infos utilisateur.',
                        'no_user_id': 'ID utilisateur manquant.',
                        'database_error': 'Erreur de base de données.',
                        'network_error': 'Erreur réseau.',
                        'session_expired': 'Session expirée. Veuillez réessayer.',
                        'unexpected_error': 'Une erreur inattendue s\'est produite.',
                    };

                    const message = errorMessages[errorParam] || `Erreur X: ${errorParam}`;
                    setError(message);
                    setLoading(false);
                    
                    setTimeout(() => {
                        router.push(`/login?error=x_auth_failed&details=${errorParam}`);
                    }, 5000);
                    return;
                }

                // Vérifier s'il y a un token
                if (!token) {
                    setError('Aucun token reçu. Veuillez réessayer.');
                    setLoading(false);
                    
                    setTimeout(() => {
                        router.push('/login?error=no_token_received');
                    }, 5000);
                    return;
                }

                console.log('Token reçu (longueur):', token.length);
                console.log('Token reçu (début):', token.substring(0, 20) + '...');

                // Valider le format du JWT
                if (token.split('.').length !== 3) {
                    setError('Format de token invalide.');
                    setLoading(false);
                    
                    setTimeout(() => {
                        router.push('/login?error=invalid_token_format');
                    }, 5000);
                    return;
                }

                // Stocker le token dans localStorage
                localStorage.setItem('access_token', token);
                console.log('Token stocké dans localStorage');
                
                // Décoder et stocker les informations utilisateur
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('Payload JWT décodé:', payload);
                    
                    // Vérifier l'expiration
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        setError('Token expiré.');
                        setLoading(false);
                        
                        setTimeout(() => {
                            router.push('/login?error=token_expired');
                        }, 5000);
                        return;
                    }
                    
                    // Stocker les infos utilisateur
                    const userData = {
                        id: payload.user_id,
                        email: payload.email,
                        name: payload.name,
                        type_compte: payload.type_compte
                    };
                    
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Données utilisateur stockées:', userData);
                    
                    console.log('✅ Authentification X réussie');
                    
                    // Redirection vers le dashboard
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 1000);

                } catch (decodeError) {
                    console.error('Erreur décodage JWT:', decodeError);
                    setError('Erreur lors du décodage du token.');
                    setLoading(false);
                    
                    setTimeout(() => {
                        router.push('/login?error=token_decode_failed');
                    }, 5000);
                    return;
                }
                
            } catch (generalError: any) {
                console.error('Erreur générale dans handleCallback:', generalError);
                setError(`Erreur inattendue: ${generalError.message}`);
                setLoading(false);
                
                setTimeout(() => {
                    router.push('/login?error=callback_processing_failed');
                }, 5000);
            }
        };

        const timer = setTimeout(handleCallback, 100);
        return () => clearTimeout(timer);
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center space-y-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Connexion X en cours...
                        </h1>
                        <p className="text-gray-600">
                            Veuillez patienter pendant que nous finalisons votre connexion X.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-red-100 p-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Erreur de connexion X
                </h1>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 text-sm text-center">{error}</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Retourner à la connexion
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Retourner à l'accueil
                    </button>
                </div>

                <p className="text-gray-500 text-xs text-center mt-6">
                    Si le problème persiste, veuillez{' '}
                    <a href="/contact" className="text-indigo-600 hover:underline">
                        nous contacter
                    </a>
                </p>
            </div>
        </div>
    );
}