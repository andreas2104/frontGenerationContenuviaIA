'use client';

import { useEffect, useState } from "react";
import { useTemplate } from "@/hooks/useTemplate";
import { Template } from "@/types/template";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

type TypeSortie = 'text' | 'image' | 'video'; 

// Interface pour les variables structurées
interface TemplateVariables {
  sujet?: string;
  ton?: 'professionnel' | 'informel' | 'créatif' | 'technique';
  longueur?: 'court' | 'moyen' | 'long';
  public_cible?: string;
  style?: string;
  [key: string]: any;
}

interface TemplateInputModalProps {
  onClose: () => void;
  template: Template | null;
  defaultUserId?: number;
  onSuccess?: (type: 'add' | 'edit', nomTemplate: string) => void;
}

type FormData = {
  nom_template: string;
  structure: string;
  variables: TemplateVariables;
  type_sortie: TypeSortie;
  public: boolean;
  id_utilisateur: number | null;
};

export default function TemplateInputModal({ onClose, template, defaultUserId = 0, onSuccess }: TemplateInputModalProps) {
  const { addTemplate, updateTemplate } = useTemplate();
  const { isAdmin, utilisateur } = useCurrentUtilisateur();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'variables'>('basic');

  // Variables par défaut
  const defaultVariables: TemplateVariables = {
    sujet: "intelligence artificielle",
    ton: "professionnel",
    longueur: "moyen",
    public_cible: "développeurs"
  };

  const [formData, setFormData] = useState<FormData>({
    nom_template: template?.nom_template ?? '',
    structure: template?.structure ?? '',
    variables: template?.variables as TemplateVariables ?? defaultVariables,
    type_sortie: (template?.type_sortie as TypeSortie) ?? 'text',
    public: template?.public ?? false,
    id_utilisateur: template?.id_utilisateur ?? defaultUserId,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        nom_template: template.nom_template,
        structure: template.structure,
        variables: (template.variables as TemplateVariables) ?? defaultVariables,
        type_sortie: template.type_sortie as TypeSortie,
        public: template.public,
        id_utilisateur: template.id_utilisateur ?? null,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id_utilisateur: defaultUserId,
      }));
    }
  }, [template, defaultUserId]);

  // Gestion des champs de base
  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (error) setError(null);
  };

  // Gestion des variables
  const handleVariableChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [key]: value
      }
    }));
  };

  // Ajouter une nouvelle variable
  const addCustomVariable = (key: string, value: string = '') => {
    setFormData(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [key]: value
      }
    }));
  };

  // Supprimer une variable
  const removeCustomVariable = (key: string) => {
    setFormData(prev => {
      const newVariables = { ...prev.variables };
      delete newVariables[key];
      return {
        ...prev,
        variables: newVariables
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.nom_template.trim()) {
      setError("Le nom du template est obligatoire.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.structure.trim()) {
      setError("La structure du template est obligatoire.");
      setIsSubmitting(false);
      return;
    }

    const newTemplate = {
      ...formData,
      id_utilisateur: utilisateur?.id ?? null,
    };
    
    try {
      if (template) {
        await updateTemplate({
          ...template,
          ...newTemplate
        });
        onSuccess?.('edit', formData.nom_template);
      } else {
        await addTemplate(newTemplate);
        onSuccess?.('add', formData.nom_template);
      }
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variables prédéfinies (non personnalisées)
  const predefinedVariables = ['sujet', 'ton', 'longueur', 'public_cible', 'style'];
  const customVariables = Object.keys(formData.variables || {}).filter(
    key => !predefinedVariables.includes(key)
  );

  // Aperçu JSON des variables
  const jsonPreview = JSON.stringify(formData.variables, null, 2);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? 'Modifier le Template' : 'Ajouter un Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
              onClick={() => setActiveTab('variables')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'variables'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Variables
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Messages d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Grid responsive pour les champs principaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-6">
                  {/* Nom du template */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nom du Template *
                    </label>
                    <input
                      type="text"
                      name="nom_template"
                      placeholder="Ex: Template d'article de blog"
                      value={formData.nom_template}
                      onChange={handleBasicChange}
                      className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Type de sortie */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Type de sortie *
                    </label>
                    <select
                      name="type_sortie"
                      value={formData.type_sortie}
                      onChange={handleBasicChange}
                      className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white"
                      disabled={isSubmitting}
                    >
                      <option value="text">Texte</option>
                      <option value="image">Image</option>
                      <option value="video">Vidéo</option>
                    </select>
                  </div>

                  {/* Checkbox Public (Admin seulement) */}
                  {isAdmin && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        name="public"
                        checked={formData.public}
                        onChange={handleBasicChange}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        disabled={isSubmitting}
                        id="public-checkbox"
                      />
                      <label htmlFor="public-checkbox" className="text-sm font-medium text-gray-700">
                        Rendre ce template public
                      </label>
                    </div>
                  )}
                </div>

                {/* Colonne droite - Aperçu des variables */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Variables disponibles</h3>
                  <div className="space-y-2">
                    {Object.entries(formData.variables || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-700">[{key}]</span>
                        <span className="text-gray-600 truncate max-w-[200px]">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-3">
                    Utilisez [nom_variable] dans la structure pour insérer ces valeurs
                  </p>
                </div>
              </div>

              {/* Structure du template (pleine largeur) */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Structure du template *
                </label>
                <textarea
                  name="structure"
                  placeholder="Ex: Rédige un article sur [sujet] avec un ton [ton] d'environ [longueur] mots pour un public de [public_cible]"
                  value={formData.structure}
                  onChange={handleBasicChange}
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-500 h-32 resize-vertical"
                  disabled={isSubmitting}
                />
                <p className="text-gray-500 text-xs mt-2">
                  Utilisez [nom_variable] pour insérer les variables définies
                </p>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="space-y-6">
              {/* Variables prédéfinies */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Variables principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sujet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <input
                      type="text"
                      placeholder="ex: intelligence artificielle"
                      value={formData.variables.sujet || ''}
                      onChange={(e) => handleVariableChange('sujet', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Ton */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ton
                    </label>
                    <select
                      value={formData.variables.ton || 'professionnel'}
                      onChange={(e) => handleVariableChange('ton', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    >
                      <option value="professionnel">Professionnel</option>
                      <option value="informel">Informel</option>
                      <option value="créatif">Créatif</option>
                      <option value="technique">Technique</option>
                    </select>
                  </div>

                  {/* Longueur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longueur
                    </label>
                    <select
                      value={formData.variables.longueur || 'moyen'}
                      onChange={(e) => handleVariableChange('longueur', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    >
                      <option value="court">Court (100-300 mots)</option>
                      <option value="moyen">Moyen (300-600 mots)</option>
                      <option value="long">Long (600+ mots)</option>
                    </select>
                  </div>

                  {/* Public cible */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Public cible
                    </label>
                    <input
                      type="text"
                      placeholder="ex: développeurs, marketeurs, étudiants"
                      value={formData.variables.public_cible || ''}
                      onChange={(e) => handleVariableChange('public_cible', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Style
                    </label>
                    <input
                      type="text"
                      placeholder="ex: académique, conversationnel, persuasif"
                      value={formData.variables.style || ''}
                      onChange={(e) => handleVariableChange('style', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Variables personnalisées */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Variables personnalisées</h3>
                  <button
                    type="button"
                    onClick={() => addCustomVariable('nouvelle_variable', 'valeur')}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={isSubmitting}
                  >
                    + Ajouter
                  </button>
                </div>

                <div className="space-y-3">
                  {customVariables.map((key) => (
                    <div key={key} className="flex gap-3 items-center bg-white p-3 rounded border">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Clé</label>
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value;
                            const currentValue = formData.variables[key];
                            removeCustomVariable(key);
                            addCustomVariable(newKey, currentValue);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Valeur</label>
                        <input
                          type="text"
                          value={formData.variables[key] as string}
                          onChange={(e) => handleVariableChange(key, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-700"
                          disabled={isSubmitting}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomVariable(key)}
                        className="p-2 text-red-500 hover:text-red-700 mt-4"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {customVariables.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      Aucune variable personnalisée. Cliquez sur `+ Ajouter` pour en créer une.
                    </p>
                  )}
                </div>
              </div>

              {/* Aperçu JSON */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Aperçu JSON des variables</h3>
                <pre className="text-green-400 text-sm overflow-auto max-h-40">
                  {jsonPreview}
                </pre>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-3 sm:mb-0">
              {activeTab === 'basic' ? 'Informations principales' : 'Gestion des variables'}
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
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {template ? 'Mise à jour...' : 'Création...'}
                  </span>
                ) : (
                  template ? 'Mettre à jour' : 'Créer le template'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}