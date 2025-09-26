import { useState, useEffect } from 'react';
import { sweetService } from '../services/sweetService';
import { SweetDto, SearchParams } from '../types';

export const useSweets = () => {
  const [sweets, setSweets] = useState<SweetDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSweets = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (err: any) {
      setError('Failed to load sweets');
    } finally {
      setIsLoading(false);
    }
  };

  const searchSweets = async (params: SearchParams) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await sweetService.searchSweets(params);
      setSweets(data);
    } catch (err: any) {
      setError('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  return {
    sweets,
    isLoading,
    error,
    loadSweets,
    searchSweets,
  };
};