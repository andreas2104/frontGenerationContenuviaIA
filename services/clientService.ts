const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';


let isRefreshing = false;
let refreshWaiters: Array<() => void> = [];
const waitForRefresh = () => new Promise<void>(resolve => refreshWaiters.push(resolve));
const notifyRefreshDone = () => { refreshWaiters.forEach(r => r()); refreshWaiters = []; };

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
    credentials: 'include',
  });

 
  if (response.status === 401) {
    console.log(' Session expirée - tentative de rafraîchissement...');
    
   
    if (endpoint.includes('/auth/refresh')) {
      console.log('Boucle détectée - arrêt du refresh');
      throw new Error('SESSION_EXPIRED');
    }

    
    if (isRefreshing) {
      await waitForRefresh();
    } else {
      isRefreshing = true;
      try {
        
        const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, { 
          method: 'POST',
          credentials: 'include', 
        });
        
        if (!refreshResponse.ok) {
          console.log(' Refresh échoué - déconnexion');
          if (typeof window !== 'undefined') window.location.href = '/login';
          throw new Error('SESSION_EXPIRED');
        }
        
        console.log('✅ Token rafraîchi');
      } finally {
        isRefreshing = false;
        notifyRefreshDone();
      }
    }

    response = await fetch(`${apiUrl}${endpoint}`, { 
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('SESSION_EXPIRED');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur serveur");
  }

  return response.json();
};