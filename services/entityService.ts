import { apiClient } from "./clientService";

export const fetchEntity = async <T>(endpoint: string): Promise<T[]> => {
  console.log(`recuperation des donnees pour ${endpoint}`);
  return apiClient<T[]>(`/${endpoint}`, {method: "GET"});
}