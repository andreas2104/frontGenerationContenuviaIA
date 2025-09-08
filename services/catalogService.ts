const apiUrl = 'http://127.0.0.1:5000/api';

export interface Prompt { id: number; titre: string; texte_prompt: string; }
export interface Template { id: number; nom: string; }
export interface ModelIA { id: number; nom_model: string; fournisseur: 'gpt' | 'grok' | 'gpt4all'; actif: boolean; }

export const fetchPrompts = async (): Promise<Prompt[]> => {
  const r = await fetch(`${apiUrl}/prompts`, { credentials: 'include' });
  if (!r.ok) throw new Error('Erreur prompts');
  return r.json();
};

export const fetchTemplates = async (): Promise<Template[]> => {
  const r = await fetch(`${apiUrl}/templates`, { credentials: 'include' });
  if (!r.ok) throw new Error('Erreur templates');
  return r.json();
};

export const fetchModels = async (): Promise<ModelIA[]> => {
  const r = await fetch(`${apiUrl}/modelIA`, { credentials: 'include' });
  if (!r.ok) throw new Error('Erreur modèles');
  return r.json();
  // Optionnel : filtrer {fournisseur in ['gpt','grok','gpt4all']} et actif
  // const models = await r.json();
  // return models.filter((m: ModelIA) => m.actif && ['gpt','grok','gpt4all'].includes(m.fournisseur))
};
