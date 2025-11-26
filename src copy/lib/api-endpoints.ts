// src/lib/api-endpoints.ts
// Endpoints do backend Railway. Nada de /leads aqui.

export type ConsultaParams = {
  tabela?: string;   // estabelecimento | empresas | ...
  termo?: string;    // palavra-chave
  estado?: string;   // UF (SP, RJ, ...)
  cidade?: string;   // código IBGE (se usar)
  limite?: number;   // default 50
};

// Lê variável de ambiente sem depender de tipos de Node (evita erro em "process")
const envApi = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL as
  | string
  | undefined;

// Normaliza a base (sem barra no fim)
const RAW_BASE =
  envApi && envApi.trim().length > 0
    ? envApi.trim()
    : "https://web-production-963f7.up.railway.app";

export const API_BASE = RAW_BASE.replace(/\/$/, "");

// Builder de query sem URLSearchParams (evita warnings/lints)
function toQuery(params: Record<string, string | number | undefined | null>): string {
  const parts: string[] = [];
  for (const k of Object.keys(params)) {
    const v = params[k];
    if (v !== undefined && v !== null && String(v).length > 0) {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export const API = {
  STATUS: `${API_BASE}/status`,
  TABELAS: `${API_BASE}/tabelas`,
  CONSULTA(p: ConsultaParams) {
    const q = toQuery({
      tabela: p.tabela || "estabelecimento",
      termo: p.termo,
      estado: p.estado,
      cidade: p.cidade,
      limite: p.limite ?? 50,
    });
    return `${API_BASE}/consulta${q}`;
  },
} as const;
