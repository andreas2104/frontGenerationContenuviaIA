'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGoogleCallback() {
    const router = useRouter();
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);

    useEffect(() => {
        const processCallback = async () => {
            try {
                console.log('=== DÉBUT TRAITEMENT CALLBACK GOOGLE ===');
                console.log('URL complète:', window.location.href);
                console.log('Search params:', window.location.search);

                // Récupérer les paramètres de l'URL
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                const error = urlParams.get('error');

                console.log('Token présent:', !!token);
                console.log('Erreur présente:', error);

                // Si il y a une erreur dans l'URL
                if (error) {
                    console.error('Erreur Google OAuth:', error);
                    setError(`Erreur Google OAuth: ${error}`);
                    setStatus('error');
                    
                    // Rediriger vers login après 3 secondes
                    setTimeout(() => {
                        router.push(`/login?error=google_auth_failed&details=${error}`);
                    }, 3000);
                    return;
                }

                // Si pas de token
                if (!token) {
                    console.error('Aucun token reçu dans l\'URL');
                    setError('Aucun token reçu');
                    setStatus('error');
                    
                    setTimeout(() => {
                        router.push('/login?error=no_token_received');
                    }, 3000);
                    return;
                }

                console.log('Token reçu (longueur):', token.length);
                console.log('Token reçu (début):', token.substring(0, 20) + '...');

                // Valider le format du JWT
                if (token.split('.').length !== 3) {
                    console.error('Format JWT invalide');
                    setError('Token invalide');
                    setStatus('error');
                    
                    setTimeout(() => {
                        router.push('/login?error=invalid_token_format');
                    }, 3000);
                    return;
                }

                // Stocker le token
                localStorage.setItem('authToken', token);
                console.log('Token stocké dans localStorage');
                
                // Décoder et stocker les informations utilisateur
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('Payload JWT décodé:', payload);
                    
                    // Vérifier l'expiration
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        console.error('Token expiré');
                        setError('Token expiré');
                        setStatus('error');
                        
                        setTimeout(() => {
                            router.push('/login?error=token_expired');
                        }, 3000);
                        return;
                    }
                    
                    // Stocker les infos utilisateur
                    const userData = {
                        id: payload.user_id,
                        email: payload.email,
                        name: payload.name,
                        prenom: payload.prenom || '',
                        nom: payload.nom || '',
                        picture: payload.picture || '',
                        type_compte: payload.type_compte
                    };
                    
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Données utilisateur stockées:', userData);
                    
                    setStatus('success');
                    
                    // Redirection vers le dashboard
                    console.log('Redirection vers /dashboard');
                    router.push('/dashboard');
                    
                } catch (decodeError) {
                    console.error('Erreur décodage JWT:', decodeError);
                    setError('Erreur lors du décodage du token');
                    setStatus('error');
                    
                    setTimeout(() => {
                        router.push('/login?error=token_decode_failed');
                    }, 3000);
                    return;
                }
                
            } catch (generalError) {
                console.error('Erreur générale dans processCallback:', generalError);
                setError(`Erreur inattendue: ${generalError.message}`);
                setStatus('error');
                
                setTimeout(() => {
                    router.push('/login?error=callback_processing_failed');
                }, 3000);
            }
        };

        // Délai pour laisser le temps à Next.js de charger
        const timer = setTimeout(processCallback, 100);
        
        return () => clearTimeout(timer);
    }, [router]);

    // Interface utilisateur selon le statut
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Connexion en cours...</h2>
                    <p className="text-sm text-gray-500">
                        Veuillez patienter pendant que nous finalisons votre connexion.
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <div className="text-green-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Connexion réussie !</h2>
                    <p className="text-sm text-gray-500">
                        Redirection en cours vers votre dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <div className="text-red-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Erreur de connexion</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {error}
                    </p>
                    <p className="text-xs text-gray-400">
                        Redirection vers la page de connexion dans quelques secondes...
                    </p>
                </div>
            </div>
        );
    }

    return null;
}