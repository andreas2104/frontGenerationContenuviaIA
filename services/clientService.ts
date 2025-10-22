const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'; // ← corrige ici si besoin

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = options.body
    ? { 'Content-Type': 'application/json', ...(options.headers || {}) }
    : { ...(options.headers || {}) };

  let response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // ← indispensable pour les cookies
  });

  // Si 401 → on tente un refresh
  if (response.status === 401) {
    const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      // rejouer la requête originale
      response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      localStorage.removeItem("user");
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur serveur");
  }

  return response.json();
};
