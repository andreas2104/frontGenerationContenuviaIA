import { ModelIA } from "@/types/modelIA";

const apiUrl = 'http://127.0.0.1:5000/api';

export const fetchModelIA = async (): Promise<ModelIA[]> => {
  try {
    const response = await fetch(`${apiUrl}/modelIA`);
    if(!response.ok) {
      throw new Error('Erreur du chargement modelIA');
    }
    return response.json();
  } catch (error) {
    console.error("erreur lors du recuperation")
    throw error;
  }
};

export const addModelIA = async (modelIA: ModelIA): Promise<{message:string; modelIA_id:number}> => {
  try {
    const response = await fetch(`${apiUrl}/modelIA`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelIA),
    });
    if(!response.ok){
      throw new Error("erreur de creation");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la creation du model IA");
    throw error;
  }
}

export const updateModelIA = async (modelIA: ModelIA): Promise<ModelIA[]> => {
  try {
    const response = await fetch(`${apiUrl}/modelIA/${modelIA.id}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelIA),
    });
    if(!response.ok) {
      throw new Error(`Erreur de chargement`);
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise a jour du chargement:", error);
    throw error;
  }
}

export const deleteModelIA = async (id:number): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/modelIA/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error("Erreur de suppression");
    }
  } catch(error) {
    console.error("Erreur lors de la suppression du modelIA", error);
    throw error;
  }
}
