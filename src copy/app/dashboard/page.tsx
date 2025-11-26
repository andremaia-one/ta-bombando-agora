'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'

type UserInfo = {
  nome: string
  email: string
  telefone: string
  segmento: string
}

type Filtros = {
  cnae: string
  uf: string
  porte: string
  faturamentoMin: string
  faturamentoMax: string
  situacao: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loaded, setLoaded] = useState(false)

  const [filtros, setFiltros] = useState<Filtros>({
    cnae: '',
    uf: '',
    porte: '',
    faturamentoMin: '',
    faturamentoMax: '',
    situacao: '',
  })

  const [buscaRealizada, setBuscaRealizada] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nome = sessionStorage.getItem('userName') || ''
    const email = sessionStorage.getItem('userEmail') || ''
    const telefone = sessionStorage.getItem('userPhone') || ''
    const segmento = sessionStorage.getItem('userSegmento') || ''

    if (nome || email || telefone || segmento) {
      setUser({ nome, email, telefone, segmento })
    }

    setLoaded(true)
  }, [])

  const handleChangeFiltro = (
    campo: keyof Filtros,
    valor: string
  ) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleBuscar = (e: FormEvent) => {
    e.preventDefault()
    // aqui depois vamos plugar chamada real para sua API de pesquisa
    console.log('[BUSCA CNAE] Filtros usados:', filtros)
    setBuscaRealizada(true)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="text-sky-400">TaBombandoAgora</span>{' '}
            <span className="text-slate-400">· Painel de Leads B2B</span>
          </h1>

          <Link
            href="/"
            className="text-sm text-slate-300 hover:text-sky-400 transition-colors"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Título e descrição */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Você está em: <span className="text-sky-400">/dashboard</span>
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">
            Painel de Leads B2B · Filtros Avançados
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl">
            Use os filtros abaixo para montar uma lista de até{' '}
            <span className="font-semibold text-sky-300">
              150 empresas por pesquisa
            </span>, conectada aos dados oficiais da Receita Federal.
          </p>
        </div>

        {/* Grid principal: dados do usuário + filtros */}
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-8">
          {/* Card com dados do usuário */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">
              Seus dados de acesso
            </h3>

            {!loaded && (
              <p className="text-sm text-slate-500">
                Carregando dados da sessão…
              </p>
            )}

            {loaded && !user && (
              <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/40 rounded-lg px-3 py-2">
                Não encontramos seus dados na sessão. Volte para a página
                inicial, preencha o formulário e tente novamente.
              </p>
            )}

            {user && (
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500">Nome</dt>
                  <dd className="text-slate-100 font-medium">
                    {user.nome || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">E-mail</dt>
                  <dd className="text-slate-100 font-medium break-all">
                    {user.email || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Telefone/WhatsApp</dt>
                  <dd className="text-slate-100 font-medium">
                    {user.telefone || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Segmento informado</dt>
                  <dd className="text-slate-100 font-medium">
                    {user.segmento || '-'}
                  </dd>
                </div>
              </dl>
            )}

            <p className="text-xs text-slate-500 pt-4">
              Nesta fase, o objetivo é garantir o fluxo do lead:
              formulário → salvamento → painel. Depois vamos plugar a
              busca real na base CNAE.
            </p>
          </div>

          {/* Card de filtros avançados */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-200">
                Filtros avançados da sua lista
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                Versão 0.1 · Demo visual
              </span>
            </div>

            <form onSubmit={handleBuscar} className="space-y-4 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                {/* CNAE */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    CNAE (código ou palavra-chave)
                  </label>
                  <input
                    type="text"
                    value={filtros.cnae}
                    onChange={(e) =>
                      handleChangeFiltro('cnae', e.target.value)
                    }
                    placeholder="Ex.: 4711-3/01 ou Supermercados"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                {/* UF */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    UF
                  </label>
                  <select
                    value={filtros.uf}
                    onChange={(e) => handleChangeFiltro('uf', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Todas as UFs</option>
                    {[
                      'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
                      'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
                      'RS','RO','RR','SC','SP','SE','TO',
                    ].map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Porte */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Porte da empresa
                  </label>
                  <select
                    value={filtros.porte}
                    onChange={(e) =>
                      handleChangeFiltro('porte', e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Todos os portes</option>
                    <option value="MEI">MEI</option>
                    <option value="ME">Microempresa</option>
                    <option value="EPP">Pequena Empresa</option>
                    <option value="MEDIA">Média Empresa</option>
                    <option value="GRANDE">Grande Empresa</option>
                  </select>
                </div>

                {/* Situação cadastral */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Situação cadastral
                  </label>
                  <select
                    value={filtros.situacao}
                    onChange={(e) =>
                      handleChangeFiltro('situacao', e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Todas</option>
                    <option value="ATIVA">Ativa</option>
                    <option value="BAIXADA">Baixada</option>
                    <option value="SUSPENSA">Suspensa</option>
                  </select>
                </div>
              </div>

              {/* Faturamento estimado */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Faturamento mín. (R$/mês)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={filtros.faturamentoMin}
                    onChange={(e) =>
                      handleChangeFiltro('faturamentoMin', e.target.value)
                    }
                    placeholder="Ex.: 50000"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Faturamento máx. (R$/mês)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={filtros.faturamentoMax}
                    onChange={(e) =>
                      handleChangeFiltro('faturamentoMax', e.target.value)
                    }
                    placeholder="Ex.: 300000"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-500 text-slate-950 text-sm font-semibold hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
                >
                  Buscar empresas agora
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFiltros({
                      cnae: '',
                      uf: '',
                      porte: '',
                      faturamentoMin: '',
                      faturamentoMax: '',
                      situacao: '',
                    })
                  }
                  className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
                >
                  Limpar filtros
                </button>
              </div>
            </form>

            {/* Área de “resultados” demo */}
            <div className="mt-4 border-t border-slate-800 pt-4">
              {!buscaRealizada && (
                <p className="text-xs text-slate-500">
                  Assim que você clicar em <span className="font-semibold">“Buscar empresas agora”</span>,
                  os resultados simulados aparecerão aqui. Depois vamos conectar com sua
                  base real de 32 milhões de empresas.
                </p>
              )}

              {buscaRealizada && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Exibindo uma prévia demonstrativa de{' '}
                    <span className="font-semibold text-sky-300">
                      até 150 empresas
                    </span>{' '}
                    com os filtros atuais.
                  </p>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono overflow-x-auto">
                    <pre>{JSON.stringify(filtros, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
