'use client';

import { useEffect, useState } from "react";
import { useProjet } from "@/hooks/useProjet";
import { Projet } from "@/types/projet";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { toast } from 'react-toastify';

type Status = 'draft' | 'active' | 'archived';

// Interface pour la configuration structurée
interface Configuration {
  version?: string;
  parametres?: {
    mode?: string;
    debug?: boolean;
    timeout?: number;
    [key: string]: any;
  };
  fonctionnalites?: {
    export?: boolean;
    notifications?: boolean;
    historique?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

type FormData = {
  nom_projet: string;
  description: string;
  status: Status;
  configuration: Configuration;
};

interface ProjetInputModalProps {
  onClose: () => void;
  projet: Projet | null;
  onSuccess?: (type: 'add' | 'edit', nomProjet: string) => void;
}

export default function ProjetInputModal({ onClose, projet, onSuccess }: ProjetInputModalProps) {
  const { addProjet, updateProjet } = useProjet();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  const defaultConfiguration: Configuration = {
    version: "1.0",
    parametres: {
      mode: "development",
      debug: true,
      timeout: 30000
    },
    fonctionnalites: {
      export: true,
      notifications: true,
      historique: true
    }
  };

  const [formData, setFormData] = useState<FormData>({
    nom_projet: projet?.nom_projet ?? '',
    description: projet?.description ?? '',
    status: (projet?.status as Status) ?? 'draft',
    configuration: projet?.configuration as Configuration ?? defaultConfiguration,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projet) {
      setFormData({
        nom_projet: projet.nom_projet,
        description: projet.description ?? '',
        status: projet.status as Status,
        configuration: (projet.configuration as Configuration) ?? defaultConfiguration,
      });
    }
  }, [projet]);

  // Gestion des champs de base
  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des champs de configuration
  const handleConfigChange = (path: string, value: any) => {
    setFormData(prev => {
      const newConfig = { ...prev.configuration };
      const keys = path.split('.');
      let current: any = newConfig;

      // Naviguer jusqu'à l'avant-dernière clé
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      // Convertir les types si nécessaire
      if (typeof value === 'string') {
        // Essayer de convertir en nombre
        if (!isNaN(Number(value)) && value.trim() !== '') {
          value = Number(value);
        }
        // Convertir les booléens
        else if (value.toLowerCase() === 'true') {
          value = true;
        }
        else if (value.toLowerCase() === 'false') {
          value = false;
        }
      }

      // Définir la valeur finale
      current[keys[keys.length - 1]] = value;

      return { ...prev, configuration: newConfig };
    });
  };

  // Ajouter un nouveau champ personnalisé
  const addCustomField = (section: 'parametres' | 'fonctionnalites' | 'root', key: string, value: string = '') => {
    setFormData(prev => {
      const newConfig = { ...prev.configuration };
      
      if (section === 'root') {
        newConfig[key] = value;
      } else {
        if (!newConfig[section]) {
          newConfig[section] = {};
        }
        (newConfig[section] as any)[key] = value;
      }
      
      return { ...prev, configuration: newConfig };
    });
  };

  // Supprimer un champ personnalisé
  const removeCustomField = (path: string) => {
    setFormData(prev => {
      const newConfig = { ...prev.configuration };
      const keys = path.split('.');
      let current: any = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      delete current[keys[keys.length - 1]];
      return { ...prev, configuration: newConfig };
    });
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
          configuration: formData.configuration,
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
          configuration: formData.configuration,
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

  // Aperçu JSON en temps réel
  const jsonPreview = JSON.stringify(formData.configuration, null, 2);

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
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {projet ? 'Modifier le Projet' : 'Ajouter un Projet'}
          </h2>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b">
          <div className="flex space-x-1 px-6">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'basic'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Informations de base
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'advanced'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Configuration avancée
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nom du Projet *
                </label>
                <input
                  type="text"
                  name="nom_projet"
                  placeholder="ex: Application E-commerce, Dashboard Analytics"
                  value={formData.nom_projet}
                  onChange={handleBasicChange}
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
                  onChange={handleBasicChange}
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
                  onChange={handleBasicChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  disabled={isSubmitting}
                >
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Section Version */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Version</h3>
                <input
                  type="text"
                  placeholder="1.0"
                  value={formData.configuration.version || ''}
                  onChange={(e) => handleConfigChange('version', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  disabled={isSubmitting}
                />
              </div>

              {/* Section Paramètres */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Paramètres</h3>
                  <button
                    type="button"
                    onClick={() => addCustomField('parametres', 'nouveau_parametre', 'valeur')}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={isSubmitting}
                  >
                    + Ajouter
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mode</label>
                    <select
                      value={formData.configuration.parametres?.mode || 'development'}
                      onChange={(e) => handleConfigChange('parametres.mode', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    >
                      <option value="development">Development</option>
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Debug</label>
                    <select
                      value={formData.configuration.parametres?.debug?.toString() || 'true'}
                      onChange={(e) => handleConfigChange('parametres.debug', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    >
                      <option value="true">Activé</option>
                      <option value="false">Désactivé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1 ">Timeout (ms)</label>
                    <input
                      type="number"
                      placeholder="30000"
                      value={formData.configuration.parametres?.timeout || 30000}
                      onChange={(e) => handleConfigChange('parametres.timeout', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Champs personnalisés paramètres */}
                  {Object.entries(formData.configuration.parametres || {}).map(([key, value]) => 
                    !['mode', 'debug', 'timeout'].includes(key) && (
                      <div key={key} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">Clé</label>
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => {
                              const newKey = e.target.value;
                              const currentValue = formData.configuration.parametres?.[key];
                              removeCustomField(`parametres.${key}`);
                              addCustomField('parametres', newKey, currentValue);
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">Valeur</label>
                          <input
                            type="text"
                            value={value as string}
                            onChange={(e) => handleConfigChange(`parametres.${key}`, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                            disabled={isSubmitting}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomField(`parametres.${key}`)}
                          className="p-2 text-red-500 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Section Fonctionnalités */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Fonctionnalités</h3>
                  <button
                    type="button"
                    onClick={() => addCustomField('fonctionnalites', 'nouvelle_fonctionnalite', 'true')}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={isSubmitting}
                  >
                    + Ajouter
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(formData.configuration.fonctionnalites || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded border">
                      <span className="font-medium text-gray-700 capitalize">{key}</span>
                      <select
                        value={value?.toString() || 'true'}
                        onChange={(e) => handleConfigChange(`fonctionnalites.${key}`, e.target.value)}
                        className="p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                        disabled={isSubmitting}
                      >
                        <option value="true">Activé</option>
                        <option value="false">Désactivé</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aperçu JSON */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Aperçu JSON</h3>
                <pre className="text-green-400 text-sm overflow-auto max-h-40">
                  {jsonPreview}
                </pre>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500 mb-3 sm:mb-0">
              {activeTab === 'basic' ? 'Informations principales' : 'Configuration avancée'}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                  projet ? 'Mettre à jour' : 'Créer le projet'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}