'use client';

import { useEffect, useState } from "react";
import { useTemplate } from "@/hooks/useTemplate";
import { Template } from "@/types/template";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";

type TypeSortie = 'text' | 'image' | 'video'; 

interface TemplateInputModalProps {
  onClose: () => void;
  template: Template | null;
  defaultUserId?: number;
  onSuccess?: (type: 'add' | 'edit', nomTemplate: string) => void;
}

type FormData = {
  nom_template: string;
  structure: string;
  variables: string;
  type_sortie: TypeSortie;
  public: boolean;
  id_utilisateur: number | null;
};

export default function TemplateInputModal({ onClose, template, defaultUserId = 0, onSuccess }: TemplateInputModalProps) {
  const { addTemplate, updateTemplate } = useTemplate();
  const { isAdmin, utilisateur } = useCurrentUtilisateur();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Template JSON par défaut pour les variables
  const defaultJsonTemplate = `{
  "sujet": "intelligence artificielle",
  "ton": "professionnel",
  "longueur": "moyen",
  "public_cible": "développeurs"
}`;

  const [formData, setFormData] = useState<FormData>({
    nom_template: template?.nom_template ?? '',
    structure: template?.structure ?? '',
    variables: template?.variables ? JSON.stringify(template.variables, null, 2) : defaultJsonTemplate,
    type_sortie: (template?.type_sortie as TypeSortie) ?? 'text',
    public: template?.public ?? false,
    id_utilisateur: template?.id_utilisateur ?? defaultUserId,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        nom_template: template.nom_template,
        structure: template.structure,
        variables: template.variables ? JSON.stringify(template.variables, null, 2) : defaultJsonTemplate,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'variables') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validation JSON en temps réel
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
    } else if (type === 'checkbox') {
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
    
    // Effacer l'erreur générale quand l'utilisateur modifie le formulaire
    if (error) setError(null);
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

    // Validation finale du JSON
    if (formData.variables && formData.variables.trim()) {
      try {
        JSON.parse(formData.variables);
      } catch {
        setError("Veuillez corriger le format JSON des variables.");
        setIsSubmitting(false);
        return;
      }
    }

    let parsedVariables: Record<string, any> | undefined;
    try {
      parsedVariables = formData.variables ? JSON.parse(formData.variables) : undefined;
    } catch {
      setError("Les variables doivent être un JSON valide.");
      setIsSubmitting(false);
      return;
    }

    const newTemplate = {
      ...formData,
      variables: parsedVariables,
      id_utilisateur: utilisateur?.id ?? null,
    };
    
    try {
      if (template) {
        await updateTemplate({
          ...template,
          ...newTemplate
        });
        // Notification de succès pour la modification
        onSuccess?.('edit', formData.nom_template);
      } else {
        await addTemplate(newTemplate);
        // Notification de succès pour l'ajout
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

        {/* Form */}
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
                  onChange={handleChange}
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
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
                  onChange={handleChange}
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 bg-white"
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
                    onChange={handleChange}
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

            {/* Colonne droite - Variables JSON */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-medium">
                  Variables (JSON)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    variables: defaultJsonTemplate
                  }))}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Réinitialiser le template
                </button>
              </div>
              <textarea
                name="variables"
                placeholder='Ex: { "sujet": "IA", "ton": "professionnel" }'
                value={formData.variables}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm h-48 resize-y text-gray-900 placeholder-gray-500 ${
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
                Variables communes : sujet, ton, longueur, public_cible, style
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
              onChange={handleChange}
              className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 h-32 resize-vertical"
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-xs mt-2">
              Utilisez [nom_variable] pour insérer les variables définies dans le JSON
            </p>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-blue-800 font-medium mb-2">💡 Guide d'utilisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Variables</h4>
                <ul className="space-y-1">
                  <li>• Définissez les variables dans le JSON</li>
                  <li>• Utilisez [variable] dans la structure</li>
                  <li>• Ex: {"{ \"sujet\": \"IA\" }"}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Types de sortie</h4>
                <ul className="space-y-1">
                  <li>• <strong>Texte</strong> : Contenu textuel</li>
                  <li>• <strong>Image</strong> : Génération d'images</li>
                  <li>• <strong>Vidéo</strong> : Contenu vidéo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
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
              className={`w-full sm:w-auto px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center ${
                jsonError || isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {template ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                template ? 'Mettre à jour' : 'Créer le template'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}