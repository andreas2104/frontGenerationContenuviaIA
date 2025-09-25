// src/pages/Register.tsx
"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useAuth"; // ton hook personnalisé

export default function RegisterPage() {
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Créer un compte
        </h2>

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />

        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />

        <input
          type="password"
          name="mot_de_passe"
          placeholder="Mot de passe"
          value={formData.mot_de_passe}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {registerMutation.isPending ? "Inscription..." : "S’inscrire"}
        </button>

        {registerMutation.isError && (
          <p className="mt-4 text-center text-sm text-red-600">
            {(registerMutation.error as Error).message}
          </p>
        )}

        {registerMutation.isSuccess && (
          <p className="mt-4 text-center text-sm text-green-600">
            ✅ Compte créé avec succès !
          </p>
        )}
      </form>
    </div>
  );
}
