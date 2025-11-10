// Definições tipadas para o Railway
export interface RailwayConfig {
  isProduction: boolean;
  publicUrl: string | null;
  staticUrl: string | null;
  environment: string | null;
}

/**
 * Função para obter a configuração do Railway no ambiente atual
 */
export function getRailwayConfig(): RailwayConfig {
  return {
    isProduction: process.env.NODE_ENV === 'production',
    publicUrl: process.env.RAILWAY_PUBLIC_URL || null,
    staticUrl: process.env.RAILWAY_STATIC_URL || null,
    environment: process.env.RAILWAY_ENVIRONMENT || null,
  };
}

/**
 * Função para obter a URL base da API com base no ambiente
 */
export function getApiBaseUrl(): string {
  // Em produção, use a URL pública do Railway
  if (process.env.NODE_ENV === 'production' && process.env.RAILWAY_PUBLIC_URL) {
    return `https://${process.env.RAILWAY_PUBLIC_URL}/api`;
  }
  
  // Em desenvolvimento, use localhost
  return 'http://localhost:3000/api';
}

/**
 * Hook para fetchAPI com suporte ao Railway
 */
export async function fetchFromApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return await response.json();
}