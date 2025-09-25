import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useHandleFacebookCallback } from '@/hooks/useAuth';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const FacebookCallbackPage: React.FC = () => {
  const router = useRouter();
  const { code, error, state } = router.query;
  const callbackMutation = useHandleFacebookCallback();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    if (router.isReady) {
      if (error) {
        setStatus('error');
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else if (code) {
        callbackMutation.mutate({ 
          code: code as string, 
          state: state as string 
        });
      }
    }
  }, [router.isReady, code, error, state, callbackMutation]);

  useEffect(() => {
    if (callbackMutation.isSuccess) {
      setStatus('success');
    } else if (callbackMutation.isError) {
      setStatus('error');
    }
  }, [callbackMutation.isSuccess, callbackMutation.isError]);

  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connexion en cours...
              </h2>
              <p className="text-gray-600">
                Nous traitons votre autorisation Facebook
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connexion réussie !
              </h2>
              <p className="text-gray-600 mb-4">
                Vos pages Facebook ont été connectées avec succès
              </p>
              <button
                onClick={handleReturnToDashboard}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Erreur de connexion
              </h2>
              <p className="text-gray-600 mb-4">
                {error ? `Erreur Facebook: ${error}` : 'Une erreur est survenue lors de la connexion'}
              </p>
              <button
                onClick={handleReturnToDashboard}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </button>
            </>
          )}
        </div>

        {callbackMutation.isPending && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              Traitement de votre autorisation Facebook...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookCallbackPage;
