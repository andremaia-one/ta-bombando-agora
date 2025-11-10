"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ————————————————————————————————————————————————————————————————
// Mini catálogo CNAE (ampliamos depois ou buscamos da API)
const CNAE_CATALOG = [
  { code: "6209100", label: "Suporte técnico, manutenção em TI" },
  { code: "6201501", label: "Desenvolvimento de programas sob encomenda" },
  { code: "6311900", label: "Tratamento de dados, provedores de serviços" },
  { code: "8020001", label: "Atividades de monitoração de sistemas de segurança" },
  { code: "7490104", label: "Consultoria em gestão empresarial" },
  { code: "5611204", label: "Restaurantes e similares" },
  { code: "4783101", label: "Comércio varejista de artigos de joalheria" },
];

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export type Filters = {
  modo?: "segmento" | "cnpj" | "campo";
  estado?: string;
  palavraChave?: string;
  cnaes?: string[];      // lista de codigos CNAE
  cnpj?: string;         // quando modo=CNPJ
  situacao?: "ATIVA" | "INATIVA" | "";
  porte?: "ME" | "EPP" | "DEMAIS" | "";
  simples?: "SIM" | "NAO" | "";
  mei?: "SIM" | "NAO" | "";
  dataAberturaDe?: string;
  dataAberturaAte?: string;
  funcionariosMin?: number;
  funcionariosMax?: number;
  faturamentoMin?: number;
  faturamentoMax?: number;
  removerContadores?: boolean; // trial: desabilitado
};

export default function LeadFilterForm({
  onApplyFilters,
}: {
  onApplyFilters: (f: Filters) => void;
}) {
  // topo: abas de modo de busca
  const [modo, setModo] = useState<Filters["modo"]>("segmento");

  // básicos
  const [estado, setEstado] = useState("");
  const [palavraChave, setPalavraChave] = useState("");
  const [cnpj, setCnpj] = useState("");

  // CNAE: chips + autocomplete
  const [cnaes, setCnaes] = useState<string[]>([]);
  const [cnaeQuery, setCnaeQuery] = useState("");
  const cnaeSugestoes = useMemo(() => {
    const q = cnaeQuery.trim().toLowerCase();
    if (!q) return [];
    return CNAE_CATALOG.filter(
      (x) => x.code.startsWith(q) || x.label.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [cnaeQuery]);

  // avançados
  const [situacao, setSituacao] = useState<Filters["situacao"]>("");
  const [porte, setPorte] = useState<Filters["porte"]>("");
  const [simples, setSimples] = useState<Filters["simples"]>("");
  const [mei, setMei] = useState<Filters["mei"]>("");
  const [dataAberturaDe, setDataAberturaDe] = useState("");
  const [dataAberturaAte, setDataAberturaAte] = useState("");
  const [funcMin, setFuncMin] = useState(0);
  const [funcMax, setFuncMax] = useState(500);
  const [fatMin, setFatMin] = useState(0);
  const [fatMax, setFatMax] = useState(10_000_000);

  const [removerContadores, setRemoverContadores] = useState(false);

  function addCnae(c: string) {
    if (!cnaes.includes(c)) setCnaes((s) => [...s, c]);
    setCnaeQuery("");
  }
  function removeCnae(c: string) {
    setCnaes((s) => s.filter((x) => x !== c));
  }

  function apply() {
    onApplyFilters({
      modo,
      estado: estado || undefined,
      palavraChave: palavraChave || undefined,
      cnaes: cnaes.length ? cnaes : undefined,
      cnpj: cnpj || undefined,
      situacao,
      porte,
      simples,
      mei,
      dataAberturaDe,
      dataAberturaAte,
      funcionariosMin: funcMin,
      funcionariosMax: funcMax,
      faturamentoMin: fatMin,
      faturamentoMax: fatMax,
      removerContadores,
    });
  }

  function clear() {
    setModo("segmento");
    setEstado("");
    setPalavraChave("");
    setCnpj("");
    setCnaes([]);
    setCnaeQuery("");
    setSituacao("");
    setPorte("");
    setSimples("");
    setMei("");
    setDataAberturaDe("");
    setDataAberturaAte("");
    setFuncMin(0);
    setFuncMax(500);
    setFatMin(0);
    setFatMax(10_000_000);
    setRemoverContadores(false);
    onApplyFilters({});
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Filtrar Leads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Abas de modo */}
        <div className="flex gap-2">
          {[
            { id: "segmento", label: "Segmento (CNAE)" },
            { id: "cnpj", label: "CNPJ" },
            { id: "campo", label: "Campo (livre)" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setModo(t.id as Filters["modo"])}
              className={`rounded-full px-3 py-1 text-sm border ${
                modo === t.id ? "bg-blue-600 text-white border-blue-600" : "bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Linha de UF */}
        <div>
          <label className="text-sm font-medium">Estado (UF)</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {UF_LIST.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        {/* Por modo */}
        {modo === "segmento" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">CNAE (adicione por código ou nome)</label>
            <input
              value={cnaeQuery}
              onChange={(e) => setCnaeQuery(e.target.value)}
              placeholder="Ex.: 6209100 ou 'suporte ti'"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {!!cnaeSugestoes.length && (
              <div className="rounded-md border bg-white text-sm">
                {cnaeSugestoes.map((s) => (
                  <button
                    key={s.code}
                    onClick={() => addCnae(s.code)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{s.code}</span>
                    <span className="text-gray-500 truncate ml-3">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
            {!!cnaes.length && (
              <div className="flex flex-wrap gap-2">
                {cnaes.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-800 px-3 py-1 text-xs border border-blue-200"
                  >
                    {c}
                    <button className="hover:text-red-600" onClick={() => removeCnae(c)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {modo === "cnpj" && (
          <div>
            <label className="text-sm font-medium">CNPJ</label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="Só números"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        )}

        {modo === "campo" && (
          <div>
            <label className="text-sm font-medium">Palavra-chave</label>
            <input
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
              placeholder="nome fantasia, rua, bairro, e-mail…"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* Avançados (UI – filtra client-side por enquanto) */}
        <details className="rounded-md border bg-gray-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold">Características (avançado)</summary>
          <div className="grid grid-cols-1 gap-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Situação</label>
                <select
                  value={situacao}
                  onChange={(e) => setSituacao(e.target.value as any)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Todas</option>
                  <option value="ATIVA">Ativa</option>
                  <option value="INATIVA">Inativa</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Porte</label>
                <select
                  value={porte}
                  onChange={(e) => setPorte(e.target.value as any)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="ME">ME</option>
                  <option value="EPP">EPP</option>
                  <option value="DEMAIS">Demais</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Optante pelo Simples</label>
                <select
                  value={simples}
                  onChange={(e) => setSimples(e.target.value as any)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Indiferente</option>
                  <option value="SIM">Sim</option>
                  <option value="NAO">Não</option>
                </select>
              </div>
              <div>
                <label className="text-sm">MEI</label>
                <select
                  value={mei}
                  onChange={(e) => setMei(e.target.value as any)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Indiferente</option>
                  <option value="SIM">Sim</option>
                  <option value="NAO">Não</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Data de abertura (de)</label>
                <input
                  type="date"
                  value={dataAberturaDe}
                  onChange={(e) => setDataAberturaDe(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm">Data de abertura (até)</label>
                <input
                  type="date"
                  value={dataAberturaAte}
                  onChange={(e) => setDataAberturaAte(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Funcionários: {funcMin} – {funcMax}</label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="range" min={0} max={1000} value={funcMin} onChange={(e)=>setFuncMin(+e.target.value)} className="w-full"/>
                  <input type="range" min={0} max={1000} value={funcMax} onChange={(e)=>setFuncMax(+e.target.value)} className="w-full"/>
                </div>
              </div>
              <div>
                <label className="text-sm">
                  Faturamento: R$ {fatMin.toLocaleString()} – R$ {fatMax.toLocaleString()}
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="range" min={0} max={20000000} step={50000} value={fatMin} onChange={(e)=>setFatMin(+e.target.value)} className="w-full"/>
                  <input type="range" min={0} max={20000000} step={50000} value={fatMax} onChange={(e)=>setFatMax(+e.target.value)} className="w-full"/>
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* Recurso pago */}
        <div className="rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Remover contato de contadores</div>
              <div className="text-xs text-gray-500">
                Indisponível no teste grátis. Adquira um pacote de créditos para habilitar.
              </div>
            </div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={removerContadores}
                onChange={(e) => setRemoverContadores(e.target.checked)}
                disabled
              />
              <span className="text-xs text-gray-500">(bloqueado)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={apply}>Aplicar filtros</Button>
          <Button variant="outline" className="flex-1" onClick={clear}>Limpar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
