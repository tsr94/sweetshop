import { api } from './api';
import { SweetDto, SearchParams } from '../types';

export const sweetService = {
  getAllSweets: async (): Promise<SweetDto[]> => {
    const response = await api.get<SweetDto[]>('/api/sweets');
    return response.data;
  },

  getSweetById: async (id: number): Promise<SweetDto> => {
    const response = await api.get<SweetDto>(`/api/sweets/${id}`);
    return response.data;
  },

  createSweet: async (sweet: Omit<SweetDto, 'id'>): Promise<SweetDto> => {
    const response = await api.post<SweetDto>('/api/sweets', sweet);
    return response.data;
  },

  updateSweet: async (id: number, sweet: Partial<SweetDto>): Promise<SweetDto> => {
    const response = await api.put<SweetDto>(`/api/sweets/${id}`, sweet);
    return response.data;
  },

  deleteSweet: async (id: number): Promise<void> => {
    await api.delete(`/api/sweets/${id}`);
  },

  restockSweet: async (id: number, quantity: number): Promise<SweetDto> => {
    const response = await api.post<SweetDto>(`/api/sweets/${id}/restock?qty=${quantity}`);
    return response.data;
  },

  purchaseSweet: async (id: number, quantity: number): Promise<SweetDto> => {
    const response = await api.post<SweetDto>(`/api/sweets/${id}/purchase?qty=${quantity}`);
    return response.data;
  },

  searchSweets: async (params: SearchParams): Promise<SweetDto[]> => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get<SweetDto[]>(`/api/sweets/search?${queryParams}`);
    return response.data;
  }
};