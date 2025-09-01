"use client";

import React, { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'; // Utiliser `next/navigation` pour le répertoire `app`

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Utilisation du hook de connexion React Query
  const { mutate: loginUser, isPending, isError, error } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(
      { email, mot_de_passe: password },
      {
        onSuccess: () => {
          // Redirection vers le tableau de bord après une connexion réussie
          router.push('/public/dashboard');
        },
      }
    );
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Connexion</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isPending ? 'Connexion en cours...' : 'Se connecter'}
      </button>

      {isError && (
        <p className="text-red-500 text-sm text-center">
          Erreur: {error instanceof Error ? error.message : 'Une erreur est survenue.'}
        </p>
      )}
    </form>
  );
};

export default LoginForm;