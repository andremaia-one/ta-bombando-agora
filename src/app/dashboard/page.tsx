'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Building2,
  Download,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Search,
} from 'lucide-react'

type CityOption = {
  value: string
  label: string
}

type Lead = {
  cnpj_basico: string
  cnpj_ordem: string
  cnpj_dv: string
  razao_social: string
  nome_fantasia: string | null
  cnae_fiscal_principal: string
  cnae_descricao: string
  uf: string
  municipio: string
  email: string | null
}

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

export default function DashboardPage() {
  const [uf, setUf] = useState<string>('ES')
  const [cidade, setCidade] = useState<string | null>(null)
  const [cnae, setCnae] = useState<string>('5611204')

  const [cidades, setCidades] = useState<CityOption[]>([])
  const [cidadesLoading, setCidadesLoading] = useState(false)
  const [cidadesError, setCidadesError] = useState<string | null>(null)

  const [onlyWithEmail, setOnlyWithEmail] = useState<boolean>(true)
  const [removeContadores, setRemoveContadores] = useState<boolean>(true)

  const [leads, setLeads] = useState<Lead[]>([])
  const [totalLeads, setTotalLeads] = useState<number | null>(null)
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [leadsError, setLeadsError] = useState<string | null>(null)

  // Carrega cidades automaticamente quando o UF muda
  useEffect(() => {
    async function loadCities() {
      if (!uf) {
        setCidades([])
        setCidade(null)
        return
      }

      setCidadesLoading(true)
      setCidadesError(null)

      try {
        const res = await fetch(`/api/cities?uf=${uf}`)
        if (!res.ok) {
          throw new Error('Erro ao carregar cidades')
        }

        const data: string[] = await res.json()
        const options = data.map((name) => ({
          value: name,
          label: name,
        }))
        setCidades(options)
        // sempre que trocar UF, volta para "todas as cidades"
        setCidade(null)
      } catch (err: any) {
        console.error(err)
        setCidadesError('Não foi possível carregar as cidades deste estado.')
        setCidades([])
      } finally {
        setCidadesLoading(false)
      }
    }

    loadCities()
  }, [uf])

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setLeadsError(null)

    if (!uf || !cnae) {
      setLeadsError('Preencha pelo menos UF e CNAE principal para pesquisar.')
      return
    }

    try {
      setLeadsLoading(true)
      setLeads([])

      const params = new URLSearchParams({
        uf,
        cnae,
        onlyWithEmail: onlyWithEmail ? 'true' : 'false',
        limit: '150',
      })

      if (cidade) {
        params.set('cidade', cidade)
      }

      const res = await fetch(`/api/leads?${params.toString()}`)

      if (!res.ok) {
        throw new Error('Erro ao buscar leads.')
      }

      const data: { total: number; leads: Lead[] } = await res.json()
      setLeads(data.leads)
      setTotalLeads(data.total)
    } catch (err: any) {
      console.error(err)
      setLeadsError('Erro ao buscar leads. Tente novamente em instantes.')
    } finally {
      setLeadsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              TáBombandoAgora • Prospecção B2B Inteligente
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard de Prospecção B2B
            </h1>
            <p className="max-w-2xl text-sm text-slate-400">
              Configure seus filtros, selecione CNAE, localização e critérios
              avançados. Veja os resultados em tempo real e exporte sua lista
              pronta para o time de vendas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Limpar filtros
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar seleção
            </Button>
          </div>
        </header>

        {/* Conteúdo principal: filtros + resultados */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
          {/* Coluna de filtros */}
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-blue-400" />
                Configure seu filtro de leads
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Selecione o ramo de atividade, localização e, se necessário, use
                filtros avançados para refinar sua lista antes de exportar ou
                enviar para o time de vendas.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Bloco CNAE */}
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="space-y-1.5">
                  <Label>CNAE principal</Label>
                  <Input
                    value={cnae}
                    onChange={(e) => setCnae(e.target.value)}
                    placeholder="Ex.: 5611204"
                    inputMode="numeric"
                    maxLength={7}
                    className="bg-slate-950/60"
                  />
                  <p className="text-[11px] text-slate-500">
                    Use o CNAE principal do seu cliente ideal. Ex.: 5611204
                    (bares, sem entretenimento).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center justify-between">
                    CNAE secundário
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                      Opcional
                    </span>
                  </Label>
                  <Input
                    disabled
                    placeholder="Disponível em planos avançados"
                    className="cursor-not-allowed bg-slate-900/80 text-[12px] text-slate-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Filtro liberado apenas para contas pagas.
                  </p>
                </div>
              </div>

              {/* Localização (UF + Cidade) */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Estado (UF)</Label>
                  <Select
                    value={uf}
                    onValueChange={(value) => setUf(value)}
                  >
                    <SelectTrigger className="bg-slate-950/60">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((sigla) => (
                        <SelectItem key={sigla} value={sigla}>
                          {sigla}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-500">
                    Assim que você escolhe o estado, as cidades são carregadas
                    automaticamente.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Cidade</Label>
                  <Select
                    value={cidade ?? 'all'}
                    onValueChange={(value) => {
                      if (value === 'all') setCidade(null)
                      else setCidade(value)
                    }}
                    disabled={cidadesLoading || !uf || cidades.length === 0}
                  >
                    <SelectTrigger className="bg-slate-950/60">
                      <SelectValue
                        placeholder={
                          !uf
                            ? 'Selecione um estado primeiro'
                            : cidadesLoading
                            ? 'Carregando cidades...'
                            : cidades.length === 0
                            ? 'Nenhuma cidade disponível'
                            : 'Todas as cidades'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as cidades</SelectItem>
                      <ScrollArea className="max-h-60">
                        {cidades.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  {cidadesError && (
                    <p className="text-[11px] text-red-400">{cidadesError}</p>
                  )}
                </div>
              </div>

              {/* Filtros avançados principais (apenas layout) */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Situação cadastral</Label>
                  <Select defaultValue="02">
                    <SelectTrigger className="bg-slate-950/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="02">Somente ativas</SelectItem>
                      <SelectItem value="04">Baixadas</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-500">
                    No backend a gente já está filtrando por &quot;02&quot;
                    (ativas).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Número de leads por pesquisa</Label>
                  <Input
                    disabled
                    defaultValue={150}
                    className="bg-slate-950/60 text-slate-400"
                  />
                  <p className="text-[11px] text-slate-500">
                    Limite padrão de testes. Em planos pagos você pode aumentar
                    esse valor.
                  </p>
                </div>
              </div>

              {/* Switches de refinamento */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Somente contatos com e-mail</p>
                    <p className="text-[11px] text-slate-500">
                      Remove empresas que não têm e-mail informado no cadastro.
                    </p>
                  </div>
                  <Switch
                    checked={onlyWithEmail}
                    onCheckedChange={setOnlyWithEmail}
                  />
                </div>

                <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      Remover contato de contadores
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Remove em até 80% os e-mails de escritórios contábeis das
                      listas.
                    </p>
                  </div>
                  <Switch
                    checked={removeContadores}
                    onCheckedChange={setRemoveContadores}
                  />
                </div>
              </div>

              {/* Botão de pesquisa + mensagem de erro */}
              <div className="flex flex-col gap-2 border-t border-slate-800 pt-4">
                {leadsError && (
                  <p className="text-xs text-red-400">{leadsError}</p>
                )}

                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={leadsLoading}
                  className="inline-flex w-full items-center justify-center gap-2 bg-blue-600 text-sm font-semibold hover:bg-blue-500 md:w-auto"
                >
                  {leadsLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Buscando leads...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Buscar leads agora
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-slate-500">
                  Dica: comece com filtros mais amplos (apenas UF + CNAE) e
                  depois refine por cidade e outros critérios.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coluna de resultados */}
          <Card className="flex min-h-[420px] flex-col border-slate-800 bg-slate-900/60 backdrop-blur">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  Resultados da pesquisa
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Os resultados aparecem aqui após você clicar em &quot;Buscar
                  leads&quot;. Você pode aplicar filtros mais específicos e
                  depois exportar.
                </CardDescription>
              </div>

              <div className="flex flex-col items-end gap-1 text-right">
                <p className="text-xs font-medium text-slate-400">
                  {totalLeads !== null
                    ? `Encontradas ${totalLeads} empresas para esses filtros`
                    : 'Nenhuma pesquisa realizada ainda'}
                </p>
                {leads.length > 0 && (
                  <p className="text-[11px] text-slate-500">
                    Mostrando as {leads.length} primeiras.
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              {/* Estado vazio */}
              {!leadsLoading && leads.length === 0 && totalLeads === null && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
                  <p>Configure os filtros ao lado e clique em &quot;Buscar leads&quot;.</p>
                  <p className="max-w-md text-xs text-slate-500">
                    Assim que os dados forem retornados do banco, você verá aqui
                    uma lista de empresas com CNPJ, razão social, localização e
                    e-mail para ação rápida do seu time comercial.
                  </p>
                </div>
              )}

              {/* Carregando */}
              {leadsLoading && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  <p>Buscando empresas com esses filtros...</p>
                  <p className="text-xs text-slate-500">
                    Dependendo do CNAE e do estado, essa busca pode retornar
                    milhares de registros no banco. Aqui mostramos um recorte
                    inicial.
                  </p>
                </div>
              )}

              {/* Lista de leads */}
              {!leadsLoading && leads.length > 0 && (
                <ScrollArea className="h-[480px] pr-2">
                  <div className="space-y-3">
                    {leads.map((lead) => {
                      const cnpjFormatado = `${lead.cnpj_basico}/${lead.cnpj_ordem}-${lead.cnpj_dv}`

                      return (
                        <div
                          key={`${lead.cnpj_basico}-${lead.cnpj_ordem}-${lead.cnpj_dv}`}
                          className="group rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/80 hover:bg-slate-900/80"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-slate-50">
                                  {lead.nome_fantasia?.trim() ||
                                    lead.razao_social}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/70 bg-emerald-500/10 text-[11px] font-semibold uppercase tracking-wide text-emerald-300"
                                >
                                  Ativa
                                </Badge>
                              </div>

                              <p className="text-xs font-mono text-slate-400">
                                CNPJ: {cnpjFormatado}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {lead.municipio} • {lead.uf}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  CNAE {lead.cnae_fiscal_principal} —{' '}
                                  {lead.cnae_descricao}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {lead.email ? (
                                <span className="inline-flex max-w-[220px] items-center gap-1 truncate rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200">
                                  <Mail className="h-3 w-3 text-blue-400" />
                                  {lead.email.toLowerCase()}
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-500">
                                  Sem e-mail cadastrado
                                </span>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-blue-500/60 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wide text-blue-300"
                              >
                                Ver empresa
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
