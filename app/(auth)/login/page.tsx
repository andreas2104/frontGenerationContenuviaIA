"use client";

import { useLogin } from "@/hooks/useAuth";
import { googleLoginRedirect } from "@/services/authService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleError] = useState<string | null>(null);

  const { mutate: loginUser, isPending, isError, error } = useLogin();

  // Vérifier s'il y a une erreur Google dans l'URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_auth_failed') {
      setGoogleError('Échec de la connexion Google. Veuillez réessayer.');
    }
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(
      { email, mot_de_passe: password },
      {
        onSuccess: (data) => {
          localStorage.setItem('authToken', data.token);
          router.push("/public/dashboard");
        },
      }
    );
  };
  
  const handleGoogleLogin = () => {
    setGoogleError(null); // Réinitialiser les erreurs
    googleLoginRedirect();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Se connecter
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Connectez-vous pour accéder à votre tableau de bord.
        </p>

        {/* Afficher les erreurs Google */}
        {googleError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{googleError}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Adresse e-mail
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 
              border border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 
              focus:border-blue-500"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="votre.email@exemple.com"
              required
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
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
              focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Se souvenir de moi
            </label>
          </div>

          {isError && (
            <p className="text-red-500 text-sm text-center">
              Erreur:{" "}
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue."}
            </p>
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
            {isPending ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <span className="absolute px-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            OU
          </span>
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent 
          rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 
          bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
          transition-colors duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="h-5 w-5 mr-2"
          />
          Se connecter avec Google
        </button>

        <div className="text-sm flex justify-between">
          <Link
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Mot de passe oublié ?
          </Link>
          <Link
            href="/registration"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Nouveau compte ?
          </Link>
        </div>
      </div>
    </div>
  );
}