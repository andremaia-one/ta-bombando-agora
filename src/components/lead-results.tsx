"use client";

import { useEffect, useMemo, useState } from "react";
import { API } from "@/lib/api-endpoints";
import type { Filters } from "./lead-filter-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Star, StarOff, MapPin, Building, Phone, Mail, ExternalLink, Download } from "lucide-react";

type Lead = {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  endereco: string;
  cnpj: string;
  situacao: "Ativa" | "Inativa";
  porte: string;
  funcionarios: number;
  faturamento: number;
};

const TRIAL_LIMIT = 150;

function formatPhone(ddd?: string, tel?: string) {
  if (!tel) return "(00) 0000-0000";
  const d = (ddd || "00").replace(/\D/g, "");
  const n = tel.replace(/\D/g, "");
  if (n.length === 8) return `(${d}) ${n.slice(0, 4)}-${n.slice(4)}`;
  if (n.length === 9) return `(${d}) ${n.slice(0, 5)}-${n.slice(5)}`;
  return `(${d}) ${n}`;
}
function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchLeads(filters: Filters): Promise<Lead[]> {
  // Construímos o “termo”: cnaes + palavra-chave + (se modo for CNPJ, priorizamos o CNPJ)
  const termo =
    filters.modo === "cnpj"
      ? filters.cnpj?.trim()
      : [filters.palavraChave, ...(filters.cnaes || [])].filter(Boolean).join(" ").trim() || undefined;

  const url = API.CONSULTA({
    tabela: "estabelecimento",
    termo,
    estado: filters.estado || undefined,
    limite: 400, // buffer
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API retornou ${res.status}`);
  const data = await res.json();

  const rows: any[] = Array.isArray(data?.dados) ? data.dados : [];
  const mapped: Lead[] = rows.map((it: any, idx: number) => ({
    id: idx + 1,
    nome: it.nome_fantasia || `Empresa ${it.cnpj}`,
    cidade: it.municipio || "",
    estado: it.uf || "",
    telefone: formatPhone(it.ddd1, it.telefone1),
    email: it.correio_eletronico || "",
    endereco: `${it.tipo_logradouro || ""} ${it.logradouro || ""}, ${it.numero || "s/n"}${
      it.complemento ? " - " + it.complemento : ""
    } - ${it.bairro || ""} - CEP: ${it.cep || ""}`,
    cnpj: it.cnpj,
    situacao: it.situacao_cadastral === "02" ? "Ativa" : "Inativa",
    porte: it.matriz_filial === "1" ? "Matriz" : "Filial",
    funcionarios: it.matriz_filial === "1" ? 100 : 50,
    faturamento: 0,
  }));

  // Aplica filtros avançados no client (por enquanto)
  const afterClientFilters = mapped.filter((lead) => {
    if (filters.situacao === "ATIVA" && lead.situacao !== "Ativa") return false;
    if (filters.situacao === "INATIVA" && lead.situacao !== "Inativa") return false;
    // porte/simples/mei: placeholders (futuros campos do backend)
    // funcionários/faturamento: placeholders (mock por enquanto)
    if (typeof filters.funcionariosMin === "number" && lead.funcionarios < filters.funcionariosMin) return false;
    if (typeof filters.funcionariosMax === "number" && lead.funcionarios > filters.funcionariosMax) return false;
    if (typeof filters.faturamentoMin === "number" && lead.faturamento < filters.faturamentoMin) return false;
    if (typeof filters.faturamentoMax === "number" && lead.faturamento > filters.faturamentoMax) return false;
    return true;
  });

  return shuffle(afterClientFilters).slice(0, TRIAL_LIMIT);
}

export default function LeadResults({ filters }: { filters: Filters | null }) {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  useEffect(() => {
    let abort = false;
    async function run() {
      setErr(null);
      setLoading(true);
      setData([]);
      setPage(1);

      try {
        if (!filters || Object.values(filters).every((v) => !v)) {
          setData([]);
          return;
        }
        const rows = await fetchLeads(filters);
        if (!abort) setData(rows);
      } catch (e: any) {
        if (!abort) setErr(e?.message || "Erro ao buscar dados");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    run();
    return () => {
      abort = true;
    };
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const view = useMemo(() => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, page, perPage]);

  const toggleFavorite = (id: number) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div className="space-y-4">
      {/* Barra topo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resultados</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
          {loading ? (
            <span className="inline-flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Buscando…</span>
          ) : (
            <>
              <span><b>{data.length}</b> lead(s) (limite trial: <b>{TRIAL_LIMIT}</b>)</span>
              <div className="ml-auto flex items-center gap-2">
                <label>Itens por página</label>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
                  className="rounded-md border px-2 py-1"
                >
                  {[10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Anterior</Button>
                  <span>Página {page} de {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Próxima</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {err && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">Erro ao buscar dados: {err}</AlertDescription>
        </Alert>
      )}

      {!loading && !err && data.length === 0 && (
        <div className="text-center p-10 border rounded-lg bg-gray-50 text-gray-500">
          Ajuste os filtros para começar.
        </div>
      )}

      {!loading && !err && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {view.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{lead.nome}</h3>
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 ${
                            lead.situacao === "Ativa"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {lead.situacao}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">CNPJ: {lead.cnpj}</div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Favoritar"
                      onClick={() => toggleFavorite(lead.id)}
                      className={favorites.includes(lead.id) ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}
                    >
                      {favorites.includes(lead.id) ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center"><Building className="h-4 w-4 mr-2 text-gray-500" />{lead.porte}</div>
                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-500" />{lead.cidade}, {lead.estado}</div>
                  </div>

                  <div className="pt-3 border-t text-sm space-y-2">
                    <div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-500" />{lead.telefone}</div>
                    <div className="flex items-center"><Mail className="h-4 w-4 mr-2 text-gray-500" />{lead.email || "-"}</div>
                    <div className="text-xs text-gray-500">{lead.endereco}</div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t p-3 flex justify-between">
                  <Button variant="outline" size="sm"><ExternalLink size={14} className="mr-2" />Ver empresa</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download size={14} className="mr-2" />Exportar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Rodapé de paginação também */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Anterior</Button>
              <span className="text-sm">Página {page} de {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Próxima</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
