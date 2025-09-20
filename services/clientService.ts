const apiUrl = 'http://127.0.0.1:5000/api';

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      mode: 'cors',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Erreur lors de la requête à ${endpoint}:`, error);
    throw error;
  }
};