// app/authGoogleCallback/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthGoogleCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const processCallback = async () => {
            try {
                console.log('=== TRAITEMENT CALLBACK GOOGLE ===');
                
                const token = searchParams.get('token');
                const error = searchParams.get('error');

                console.log('Token reçu:', !!token);
                console.log('Erreur:', error);

                if (error) {
                    console.error('Erreur OAuth:', error);
                    router.push(`/login?error=google_auth_failed&details=${error}`);
                    return;
                }

                if (!token) {
                    console.error('Aucun token reçu');
                    router.push('/login?error=no_token_received');
                    return;
                }

                // Stocker le token
                localStorage.setItem('access_token', token);
                console.log('Token stocké avec succès');

                // Décoder le token pour vérification
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('Utilisateur:', payload.email);
                    
                    // Stocker les infos utilisateur basiques
                    localStorage.setItem('user', JSON.stringify({
                        id: payload.user_id,
                        email: payload.email,
                        name: payload.name || payload.email.split('@')[0]
                    }));
                    
                    // Redirection immédiate vers le dashboard
                    router.push('/dashboard');
                    
                } catch (decodeError) {
                    console.error('Erreur décodage token:', decodeError);
                    router.push('/login?error=invalid_token');
                }
                
            } catch (error) {
                console.error('Erreur générale:', error);
                router.push('/login?error=callback_failed');
            }
        };

        processCallback();
    }, [router, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Finalisation de la connexion...</h2>
                <p className="text-sm text-gray-500">
                    Veuillez patienter.
                </p>
            </div>
        </div>
    );
}