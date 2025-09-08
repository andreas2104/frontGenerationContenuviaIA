"use client";

import { useRegister } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const { mutate: registerUser, isPending, isError, error } = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    registerUser(
      { nom, prenom, email, mot_de_passe: password, role },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Inscription
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Créez un compte pour accéder à votre tableau de bord.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nom"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom
              </label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border 
                border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
                placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="prenom"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border 
                border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
                placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border 
              border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border 
              border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border 
              border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Rôle
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Rôle"
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border 
              border-gray-300 dark:border-gray-600 rounded-full shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {isError && (
            <div className="text-red-500 text-sm text-center">
              Erreur: {error instanceof Error ? error.message : "Une erreur est survenue."}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
            rounded-full shadow-sm text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 
            disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isPending ? "Inscription en cours..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}