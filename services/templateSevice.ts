import { Template } from "@/types/template";
import { apiClient } from "./clientService";


export const fetchAllTemplates = async (): Promise<Template[]> => {
  console.log(' Récupération des templates...');
  return apiClient<Template[]>('/templates', {method: 'GET' });
};

export const fetchTempleteById = async (templateId: number): Promise<Template> => {
return apiClient<Template>(`/templates/${templateId}`, {
  method: 'GET'
});
}

export const addTemplate = async (template: Omit<Template, 'id'>): Promise<{ message: string; template_id: number }> => {
  console.log(' Création d\'un template...');
  return apiClient<{message: string; template_id: number}>('/templates',{
    method: 'POST',
    body: JSON.stringify(template)});
};

export const updateTemplate = async (template: Template): Promise<{ message: string }> => {
  console.log(' Mise à jour du template ID:', template.id);
  return apiClient<{message: string}>(`/templates/${template.id}`, {
    method: 'PUT',
    body: JSON.stringify(template),
  });
};


export const deleteTemplate = async (templateId: number): Promise<{ message: string }> => {
  console.log('Suppression du template ID:', templateId);
  return apiClient<{message: string}>(`/templates/${templateId}`, {
    method: 'DELETE',
  });
};