'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthGoogleCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                console.log('=== VÉRIFICATION CALLBACK GOOGLE ===');
                
                // Vérifier s'il y a une erreur dans l'URL
                const errorParam = searchParams.get('error');
                const provider = searchParams.get('provider');

                if (errorParam) {
                    const errorMessages: { [key: string]: string } = {
                        'auth_denied': 'Autorisation refusée par l\'utilisateur.',
                        'no_code': 'Code d\'authentification manquant.',
                        'no_state': 'État de sécurité manquant.',
                        'invalid_state': 'État de sécurité invalide.',
                        'token_exchange_failed': 'Échec de l\'échange de token.',
                        'no_access_token': 'Token d\'accès manquant.',
                        'user_info_failed': 'Impossible de récupérer les infos utilisateur.',
                        'email_not_verified': 'Email non vérifié chez Google.',
                        'no_email': 'Aucune adresse email trouvée.',
                        'database_error': 'Erreur de base de données.',
                        'network_error': 'Erreur réseau.',
                        'unexpected_error': 'Erreur inattendue.',
                        'timeout': 'Délai d\'attente dépassé.',
                        'server_error': 'Erreur serveur.',
                    };

                    const message = errorMessages[errorParam] || `Erreur: ${errorParam}`;
                    setError(message);
                    setLoading(false);
                    
                    setTimeout(() => {
                        router.push(`/login?error=google_auth_failed&details=${errorParam}`);
                    }, 3000);
                    return;
                }

                // Si pas d'erreur, c'est que l'authentification a réussi
                // Le backend a déjà créé les cookies JWT
                console.log('✅ Authentification Google réussie - Redirection vers dashboard');
                
                // Vérifier que l'utilisateur est bien authentifié avant la redirection
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);

            } catch (err: any) {
                console.error('Erreur dans handleCallback Google:', err);
                setError('Erreur inattendue lors du traitement de la connexion Google.');
                setLoading(false);
                
                setTimeout(() => {
                    router.push('/login?error=google_callback_error');
                }, 3000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-red-100 p-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Erreur de connexion Google
                    </h1>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700 text-sm text-center">{error}</p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => router.push('/login')}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Retourner à la connexion
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center space-y-6">
                {/* Logo Google */}
                <div className="flex justify-center">
                    <div className="bg-white rounded-full p-4 shadow-lg">
                        <svg className="w-12 h-12" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    </div>
                </div>

                {/* Spinner */}
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Connexion Google en cours...
                    </h1>
                    <p className="text-gray-600">
                        Finalisation de votre connexion avec Google...
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}