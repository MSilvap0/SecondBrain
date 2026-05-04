import { API_BASE_URL } from '../../shared/constants/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Wrapper para fetch com autenticação automática
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { token, headers, ...restOptions } = options;
  
  // Pegar token do localStorage se não foi fornecido
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: defaultHeaders,
  });

  return response;
}

/**
 * Wrapper para fetch que já faz parse do JSON
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T; response: Response }> {
  const response = await apiFetch(endpoint, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erro na requisição');
  }
  
  return { data, response };
}

/**
 * GET request
 */
export async function apiGet<T = any>(endpoint: string, token?: string) {
  return apiRequest<T>(endpoint, { method: 'GET', token });
}

/**
 * POST request
 */
export async function apiPost<T = any>(endpoint: string, body: any, token?: string) {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    token,
  });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(endpoint: string, body: any, token?: string) {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    token,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(endpoint: string, token?: string) {
  return apiRequest<T>(endpoint, { method: 'DELETE', token });
}
