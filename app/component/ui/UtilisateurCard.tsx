'use client'

import { Utilisateur } from "@/types/utilisateur"

interface UtilisateurCardProps {
  utilisateur: Utilisateur;
}

export default function UtilisteurCard({ utilisateur }: UtilisateurCardProps) {
  return (
       <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
      <div className="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
        {utilisateur.prenom.charAt(0)}{utilisateur.nom.charAt(0)}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {utilisateur.prenom} {utilisateur.nom}
      </h2>
      <p className="text-sm text-gray-500 mb-2">{utilisateur.email}</p>
      <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
        {utilisateur.role.toUpperCase()}
      </span>
    </div>
  );
}