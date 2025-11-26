// IMPORTANT : On utilise l'axios configuré du projet qui contient déjà le token
import axios from '@/auth/api/axios';
import { PrestationTypeDTO } from './models';

// L'URL correcte avec le port 8086
const API_URL = 'http://localhost:8086/api/prestation-types';

export const PrestationService = {
  getAll: async () => {
    // Pas besoin de getHeaders(), axios le fait automatiquement ici
    const response = await axios.get<PrestationTypeDTO[]>(API_URL);
    return response.data;
  },

  getByCode: async (code: string) => {
    const response = await axios.get<PrestationTypeDTO>(`${API_URL}/${code}`);
    return response.data;
  },

  create: async (data: PrestationTypeDTO) => {
    const response = await axios.post<PrestationTypeDTO>(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: PrestationTypeDTO) => {
    const response = await axios.put<PrestationTypeDTO>(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};