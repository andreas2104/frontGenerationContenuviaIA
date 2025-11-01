"use client";

import { useLogin } from "@/hooks/useAuth";
import { googleLoginRedirect, xLoginRedirect } from "@/services/authService";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [xError, setXError] = useState<string | null>(null);

  const { 
    mutate: loginUser, 
    isPending, 
    isError, 
    error 
  } = useLogin();

  // Gestion des erreurs optimisée avec useCallback
  const handleAuthErrors = useCallback(() => {
    const errorParam = searchParams.get('error');
    const authProvider = searchParams.get('provider');

    if (!errorParam) return;

    const errorMessages: { [key: string]: string } = {
      'google_auth_failed': 'Échec de la connexion Google. Veuillez réessayer.',
      'x_auth_failed': 'Échec de la connexion X. Veuillez réessayer.',
      'no_token_received': 'Aucun token reçu. Veuillez réessayer.',
      'invalid_token_format': 'Token invalide. Veuillez réessayer.',
      'token_expired': 'Session expirée. Veuillez vous reconnecter.',
      'token_decode_failed': 'Erreur technique. Veuillez réessayer.',
    };

    const message = errorMessages[errorParam] || `Erreur d'authentification: ${errorParam}`;

    if (authProvider === 'google' || errorParam.includes('google')) {
      setGoogleError(message);
    } else if (authProvider === 'x' || errorParam.includes('x') || errorParam.includes('twitter')) {
      setXError(message);
    }
  }, [searchParams]);

  useEffect(() => {
    handleAuthErrors();
  }, [handleAuthErrors]);

  // Handlers mémoïsés
  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    loginUser(
      { email, mot_de_passe: password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (error) => console.error("Erreur de connexion:", error)
      }
    );
  }, [email, password, loginUser, router]);

  const handleGoogleLogin = useCallback(() => {
    setGoogleError(null); 
    googleLoginRedirect();
  }, []);

  const handleXLogin = useCallback(() => {
    setXError(null);
    xLoginRedirect();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* En-tête optimisée */}
        <div className="text-center space-y-4">
          <div className='
            bg-white dark:bg-gray-800
            rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-600
            transition-all duration-300 hover:scale-105
            group relative overflow-hidden mx-auto w-24 h-24
            flex items-center justify-center
          '>
            <Image
              src={"/image/logs.png"}
              width={60}
              height={45}
              alt='Media Tower Logo'
              className='relative z-10 transition-transform duration-300'
              priority // ← Important pour le LCP
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Se connecter
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Connectez-vous pour accéder à votre tableau de bord.
        </p>

        {/* Affichage conditionnel des erreurs */}
        {googleError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 animate-fadeIn">
            <p className="text-red-600 text-sm">{googleError}</p>
          </div>
        )}

        {xError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 animate-fadeIn">
            <p className="text-red-600 text-sm">{xError}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
              Adresse e-mail
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 
              border border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 
              focus:border-blue-500 transition-colors duration-200"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="votre.email@exemple.com"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Entrez votre mot de passe"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 
              border border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 
              focus:border-blue-500 transition-colors duration-200"
              disabled={isPending}
            />
          </div>

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 animate-fadeIn">
              <p className="text-red-600 text-sm text-center">
                {error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion."}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
            rounded-full shadow-sm text-sm font-medium text-white 
            bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
            focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
            transition-colors duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </div>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <span className="absolute px-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            OU
          </span>
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isPending}
            className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 
            rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 
            bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
            transition-colors duration-200 disabled:opacity-50"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="h-5 w-5 mr-2"
            />
            Google
          </button>
          
          <button
            onClick={handleXLogin} 
            disabled={isPending}
            className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 
            rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 
            bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            transition-colors duration-200 disabled:opacity-50"
          >
            <Image
              src={'/image/xlogo.jpeg'}
              alt="X (Twitter) logo"
              width={20}
              height={20}
              className="h-5 w-5 mr-2"
            />
            X
          </button>
        </div>

        <div className="text-sm flex justify-between">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Mot de passe oublié ?
          </Link>
          <Link
            href="/registration"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Nouveau compte ?
          </Link>
        </div>
      </div>
    </div>
  );
}