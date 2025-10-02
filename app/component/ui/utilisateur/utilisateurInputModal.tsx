'use client';

import { useState, useEffect } from "react";
import { Utilisateur } from "@/types/utilisateur";
import { toast } from 'react-toastify';

interface UtilisateurInputModalProps {
  utilisateur?: Utilisateur | null;
  onClose: () => void;
  onSave: (data: Partial<Utilisateur>) => void;
  onSuccess?: (type: 'add' | 'edit', nomUtilisateur: string) => void;
}

export default function UtilisateurInputModal({ utilisateur, onClose, onSave, onSuccess }: UtilisateurInputModalProps) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    type_compte: "user" as "admin" | "user" | "free" | "premium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (utilisateur) {
      setFormData({
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
        type_compte: utilisateur.type_compte
      });
    }
  }, [utilisateur]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("❌ Veuillez entrer une adresse email valide.");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave({ 
        id: utilisateur?.id, 
        prenom: formData.prenom, 
        nom: formData.nom, 
        email: formData.email, 
        type_compte: formData.type_compte 
      });

      // Notification de succès
      if (utilisateur) {
        toast.success("🔄 Utilisateur modifié avec succès !");
        if (onSuccess) onSuccess('edit', `${formData.prenom} ${formData.nom}`);
      } else {
        toast.success("✅ Utilisateur créé avec succès !");
        if (onSuccess) onSuccess('add', `${formData.prenom} ${formData.nom}`);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error("❌ Erreur lors de la sauvegarde de l'utilisateur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeCompteColor = (type: string) => {
    switch (type) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'premium': return 'text-purple-600 bg-purple-100';
      case 'free': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getTypeCompteLabel = (type: string) => {
    switch (type) {
      case 'admin': return 'Administrateur';
      case 'premium': return 'Premium';
      case 'free': return 'Gratuit';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {utilisateur ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h2>
          {utilisateur && (
            <p className="text-gray-600 text-sm mt-1">
              Modification de {utilisateur.prenom} {utilisateur.nom}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Grid pour les champs principaux */}
          <div className="grid grid-cols-1 gap-6">
            {/* Prénom */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="ex: Jean, Marie, Pierre"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Nom */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="ex: Dupont, Martin, Bernard"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ex: jean.dupont@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Type de compte */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Type de compte
              </label>
              <select
                name="type_compte"
                value={formData.type_compte}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                disabled={isSubmitting}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
                <option value="free">Gratuit</option>
                <option value="premium">Premium</option>
              </select>
              
              {/* Indicateur visuel du type de compte */}
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeCompteColor(formData.type_compte)}`}>
                  {getTypeCompteLabel(formData.type_compte)}
                </span>
              </div>
            </div>

            {/* Informations sur les types de compte */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-800 font-medium mb-2">ℹ️ Types de compte</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <strong>Admin:</strong> Accès complet au système
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  <strong>Premium:</strong> Fonctionnalités avancées
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <strong>Utilisateur:</strong> Accès standard
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <strong>Gratuit:</strong> Fonctionnalités de base
                </li>
              </ul>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-colors font-medium ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {utilisateur ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                utilisateur ? 'Mettre à jour' : 'Créer l\'utilisateur'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}