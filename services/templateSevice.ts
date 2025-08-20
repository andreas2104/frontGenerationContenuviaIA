import { Template } from "@/types/template";

const apiUrl = 'http://127.0.0.1:5000/api';

export const fetchAllTemplates = async (): Promise<Template[]> => {
  try {
    const response = await fetch(`${apiUrl}/templates`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des templates.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des templates :", error);
    throw error;
  }
};

export const addTemplate = async (template: Template): Promise<{ message: string; template_id: number }> => {
  try {
    const response = await fetch(`${apiUrl}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error("Erreur de création du template.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la création du template :", error);
    throw error;
  }
};

export const updateTemplate = async (template: Template): Promise<Template> => {
  try {
    const response = await fetch(`${apiUrl}/templates/${template.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error("Erreur de mise à jour du template.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du template :", error);
    throw error;
  }
};

export const deleteTemplate = async (templateId: number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/templates/${templateId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error("Erreur de suppression du template.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du template :", error);
    throw error;
  }
};