import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
}

// Получаем адрес backend динамически
function getBackendUrl() {
  if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
    // Jest/test среда
    if (typeof globalThis.importMeta !== 'undefined' && globalThis.importMeta.env) {
      return globalThis.importMeta.env.VITE_BACKEND_URL;
    }
  } else if (typeof window !== 'undefined') {
    // Браузер/Vite
    try {
      // Динамический import для избежания синтаксической ошибки
      return new Function('return import.meta.env.VITE_BACKEND_URL')();
    } catch {}
  }
  return 'http://localhost:3001';
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const backendUrl = getBackendUrl();

  const { data: user, error } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/api/user`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (error || user) {
      setIsLoading(false);
    }
  }, [error, user]);

  const login = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  const logout = async () => {
    await fetch(`${backendUrl}/auth/logout`, {
      credentials: 'include',
    });
    queryClient.setQueryData(['user'], null);
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
  };
}; 