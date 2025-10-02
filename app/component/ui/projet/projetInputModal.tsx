'use client';

import { useEffect, useState } from "react";
import { useProjet } from "@/hooks/useProjet";
import { Projet } from "@/types/projet";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { toast } from 'react-toastify';

type Status = 'draft' | 'active' | 'archived';

type FormData = {
  nom_projet: string;
  description: string;
  status: Status;
  configuration: string;
};

interface ProjetInputModalProps {
  onClose: () => void;
  projet: Projet | null;
  onSuccess?: (type: 'add' | 'edit', nomProjet: string) => void;
}

export default function ProjetInputModal({ onClose, projet, onSuccess }: ProjetInputModalProps) {
  const { addProjet, updateProjet } = useProjet();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  const defaultJsonTemplate = `{
  "version": "1.0",
  "parametres": {
    "mode": "development",
    "debug": true,
    "timeout": 30000
  },
  "fonctionnalites": {
    "export": true,
    "notifications": true,
    "historique": true
  }
}`;

  const [formData, setFormData] = useState<FormData>({
    nom_projet: projet?.nom_projet ?? '',
    description: projet?.description ?? '',
    status: (projet?.status as Status) ?? 'draft',
    configuration: projet?.configuration ? JSON.stringify(projet.configuration, null, 2) : defaultJsonTemplate,
  });

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projet) {
      setFormData({
        nom_projet: projet.nom_projet,
        description: projet.description ?? '',
        status: projet.status as Status,
        configuration: projet?.configuration ? JSON.stringify(projet.configuration, null, 2) : defaultJsonTemplate,
      });
    }
  }, [projet]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'configuration') {
      setFormData((prev) => ({ ...prev, configuration: value }));


      try {
        if (value.trim()) {
          JSON.parse(value);
          setJsonError(null);
        } else {
          setJsonError(null);
        }
      } catch {
        setJsonError("JSON invalide ⚠️");
      }
    } else if (name === 'status') {
      setFormData((prev) => ({ ...prev, status: value as Status }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (!utilisateur) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.nom_projet.trim()) {
      toast.warning("Le nom du projet est obligatoire.");
      setIsSubmitting(false);
      return;
    }

    if (formData.configuration && formData.configuration.trim()) {
      try {
        JSON.parse(formData.configuration);
      } catch (error) {
        toast.error("Veuillez corriger le format JSON de la configuration.");
        setIsSubmitting(false);
        return;
      }
    }

    let parsedConfig: Record<string, any> | undefined;
    try {
      parsedConfig = formData.configuration ? JSON.parse(formData.configuration) : undefined;
    } catch {
      toast.error("La configuration doit être un JSON valide.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (projet) {
        const canModify = isAdmin || Number(projet.id_utilisateur) === Number(utilisateur.id);
        if (!canModify) {
          toast.error("Vous n'avez pas la permission de modifier ce projet.");
          setIsSubmitting(false);
          return;
        }

        await updateProjet({
          ...projet,
          nom_projet: formData.nom_projet,
          description: formData.description || undefined,
          status: formData.status,
          configuration: parsedConfig,
        });
        
        toast.success("🔄 Projet modifié avec succès !");
        
        if (onSuccess) {
          onSuccess('edit', formData.nom_projet);
        }
      } else {
        await addProjet({
          id_utilisateur: Number(utilisateur.id),
          nom_projet: formData.nom_projet,
          description: formData.description || undefined,
          status: formData.status,
          configuration: parsedConfig,
        });
        
        toast.success("✅ Projet créé avec succès !");

        if (onSuccess) {
          onSuccess('add', formData.nom_projet);
        }
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la soumission du projet.";
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
          <p className="text-xl font-semibold text-gray-900 text-center">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg text-center">
          <p className="text-xl text-red-600 font-semibold mb-4">Utilisateur non connecté</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {projet ? 'Modifier le Projet' : 'Ajouter un Projet'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nom du Projet
              </label>
              <input
                type="text"
                name="nom_projet"
                placeholder="ex: Application E-commerce, Dashboard Analytics"
                value={formData.nom_projet}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Décrivez le but et les objectifs de votre projet..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 min-h-[100px] resize-y"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                disabled={isSubmitting}
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-medium">
                  Configuration (JSON)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    configuration: defaultJsonTemplate
                  }))}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Réinitialiser le template
                </button>
              </div>
              <textarea
                name="configuration"
                placeholder="Configuration en JSON"
                value={formData.configuration}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm min-h-[150px] resize-y text-gray-900 placeholder-gray-500 ${
                  jsonError ? 'border-red-500' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-60' : ''}`}
                disabled={isSubmitting}
              />
              {jsonError && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {jsonError}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                Configuration du projet : version, paramètres, fonctionnalités, etc.
              </p>
            </div>
          </div>

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
              disabled={!!jsonError || isSubmitting}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-colors font-medium ${
                jsonError || isSubmitting
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
                  {projet ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                projet ? 'Mettre à jour' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}