// lib/api/projet.ts
// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';

// interface CreateProjetData {
//   id_utilisateur: number;
//   nom_projet: string;
//   description: string;
//   status?: string;
//   configuration?: Record<string, any> | string;
// }

// interface CreateProjetResponse {
//   message: string;
//   projet_id: number;
// }
// const apiUrl = 'http://127.0.0.1:5000/api';

// const createProjet = async (data: CreateProjetData): Promise<CreateProjetResponse> => {
//   const response = await axios.post('http://127.0.0.1:5000/api/projets', data, {
//     headers: { 'Content-Type': 'application/json' },
//   });
//   return response.data;
// };

// export const useCreateProjet = () => {
//   return useMutation<CreateProjetResponse, Error, CreateProjetData>({
//     mutationFn: createProjet,
//     onSuccess: (data) => {
//       console.log('Projet created successfully:', data);
//     },
//     onError: (error) => {
//       console.error('Error creating projet:', error);
//     },
//   });
// };