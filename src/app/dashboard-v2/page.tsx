'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, Filter, Building2, MapPin, Mail, Phone, 
  TrendingUp, Users, BarChart3, FileText, Download,
  ChevronDown, ChevronUp, Loader2, X, Sparkles,
  Target, CheckCircle2
} from 'lucide-react'

// ==========================================
// TYPES
// ==========================================

interface FilterState {
  activeTab: 'avancado' | 'segmento' | 'cnpj' | 'especifico'
  cnae: string
  cnaeSecundario: boolean
  uf: string
  cidade: string
  situacaoCadastral: string[]
  tipo: string[]
  naturezaJuridica: string[]
  porte: string[]
  capitalSocial: { min: string, max: string }
  dataAbertura: { inicio: string, fim: string }
  removerContadores: boolean
}

interface CnaeOption {
  value: string
  label: string
  descricao: string
  _source?: string
}

// ==========================================
// DATA
// ==========================================

const ESTADOS_BRASILEIROS = [
  { value: '11', label: 'Rondônia' }, { value: '12', label: 'Acre' }, { value: '13', label: 'Amazonas' },
  { value: '14', label: 'Roraima' }, { value: '15', label: 'Pará' }, { value: '16', label: 'Amapá' },
  { value: '17', label: 'Tocantins' }, { value: '21', label: 'Maranhão' }, { value: '22', label: 'Piauí' },
  { value: '23', label: 'Ceará' }, { value: '24', label: 'Rio Grande do Norte' }, { value: '25', label: 'Paraíba' },
  { value: '26', label: 'Pernambuco' }, { value: '27', label: 'Alagoas' }, { value: '28', label: 'Sergipe' },
  { value: '29', label: 'Bahia' }, { value: '31', label: 'Minas Gerais' }, { value: '32', label: 'Espírito Santo' },
  { value: '33', label: 'Rio de Janeiro' }, { value: '35', label: 'São Paulo' }, { value: '41', label: 'Paraná' },
  { value: '42', label: 'Santa Catarina' }, { value: '43', label: 'Rio Grande do Sul' },
  { value: '50', label: 'Mato Grosso do Sul' }, { value: '51', label: 'Mato Grosso' },
  { value: '52', label: 'Goiás' }, { value: '53', label: 'Distrito Federal' },
]

const SITUACOES = [
  { value: '02', label: 'Ativa' }, { value: '01', label: 'Nula' },
  { value: '03', label: 'Suspensa' }, { value: '04', label: 'Inapta' }, { value: '08', label: 'Baixada' },
]

// ==========================================
// ACCORDION COMPONENT
// ==========================================

const Accordion = ({ title, isOpen, onToggle, children, badge }: any) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-gray-900">{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">{badge}</span>
        )}
      </div>
      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
    {isOpen && <div className="px-4 py-3 bg-gray-50">{children}</div>}
  </div>
)

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DashboardV2() {
  const [filters, setFilters] = useState<FilterState>({
    activeTab: 'avancado',
    cnae: '',
    cnaeSecundario: false,
    uf: '',
    cidade: '',
    situacaoCadastral: ['02'],
    tipo: [],
    naturezaJuridica: [],
    porte: [],
    capitalSocial: { min: '', max: '' },
    dataAbertura: { inicio: '', fim: '' },
    removerContadores: false,
  })

  const [cnaeOptions, setCnaeOptions] = useState<CnaeOption[]>([])
  const [cnaeLoading, setCnaeLoading] = useState(false)
  const [showCnaeDropdown, setShowCnaeDropdown] = useState(false)
  const [cidadeOptions, setCidadeOptions] = useState<any[]>([])
  const [cidadeLoading, setCidadeLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const [openSections, setOpenSections] = useState({
    cnae: true,
    localizacao: true,
    situacao: false,
    caracteristicas: false,
  })

  const cnaeInputRef = useRef<HTMLInputElement>(null)

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    if (filters.uf) {
      setFilters(prev => ({ ...prev, cidade: '' }))
      setCidadeOptions([])
      loadCidades(filters.uf)
    } else {
      setCidadeOptions([])
      setFilters(prev => ({ ...prev, cidade: '' }))
    }
  }, [filters.uf])

  // ==========================================
  // API FUNCTIONS
  // ==========================================

  const searchCnaes = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setCnaeOptions([])
      return
    }

    setCnaeLoading(true)
    try {
      const response = await fetch(`/api/cnaes?q=${encodeURIComponent(searchTerm)}&limit=50`)
      const data = await response.json()

      if (data.success) {
        setCnaeOptions(data.cnaes)
      }
    } catch (error) {
      console.error('Erro ao buscar CNAEs:', error)
    } finally {
      setCnaeLoading(false)
    }
  }

  const loadCidades = async (uf: string) => {
    setCidadeLoading(true)
    try {
      const response = await fetch(`/api/cidades?uf=${uf}`)
      const data = await response.json()

      if (data.success) {
        setCidadeOptions(data.cidades)
      }
    } catch (error) {
      console.error('Erro ao buscar cidades:', error)
    } finally {
      setCidadeLoading(false)
    }
  }

  const handleSearch = async () => {
    if (filters.activeTab === 'avancado') {
      if (!filters.cnae && !filters.uf) {
        alert('Selecione pelo menos CNAE ou Estado (UF)')
        return
      }
    }

    console.log('🔍 Iniciando busca com filtros:', filters)
    setIsSearching(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })

      const data = await response.json()
      console.log('📊 Resposta da API:', data)

      if (data.success) {
        setSearchResults(data.results || [])
        setTotalResults(data.total || 0)
        setShowResults(true)
        console.log(`✅ ${data.total} empresas encontradas!`)
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro na busca:', error)
      alert('Erro ao buscar empresas')
    } finally {
      setIsSearching(false)
    }
  }

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleCnaeChange = (value: string) => {
    setFilters(prev => ({ ...prev, cnae: value }))
    searchCnaes(value)
    setShowCnaeDropdown(true)
  }

  const selectCnae = (cnae: CnaeOption) => {
    setFilters(prev => ({ ...prev, cnae: cnae.value }))
    setShowCnaeDropdown(false)
    setCnaeOptions([])
  }

  const toggleArrayFilter = (field: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  const limparFiltros = () => {
    setFilters({
      activeTab: 'avancado',
      cnae: '',
      cnaeSecundario: false,
      uf: '',
      cidade: '',
      situacaoCadastral: ['02'],
      tipo: [],
      naturezaJuridica: [],
      porte: [],
      capitalSocial: { min: '', max: '' },
      dataAbertura: { inicio: '', fim: '' },
      removerContadores: false,
    })
    setSearchResults([])
    setTotalResults(0)
    setShowResults(false)
  }

  const countActiveFilters = () => {
    let count = 0
    if (filters.cnae) count++
    if (filters.uf) count++
    if (filters.cidade) count++
    if (filters.situacaoCadastral.length > 0) count++
    if (filters.tipo.length > 0) count++
    if (filters.removerContadores) count++
    return count
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TáBombandoAgora</h1>
                <p className="text-xs text-gray-500 font-medium">Dashboard V2 • Prospecção B2B</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-700">Online</span>
              </div>
              
              {totalResults > 0 && (
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                  <span className="text-xs font-bold text-blue-600">{totalResults.toLocaleString()} Leads</span>
                </div>
              )}

              <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-md transition-all">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar: Filtros */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl border shadow-lg sticky top-24">
              {/* Tabs */}
              <div className="p-3 border-b">
                <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, activeTab: 'avancado' }))}
                    className={`px-2 py-2 rounded-md text-xs font-bold transition-all ${
                      filters.activeTab === 'avancado'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Avançado
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, activeTab: 'segmento' }))}
                    className={`px-2 py-2 rounded-md text-xs font-bold transition-all ${
                      filters.activeTab === 'segmento'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Segmento
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, activeTab: 'cnpj' }))}
                    className={`px-2 py-2 rounded-md text-xs font-bold transition-all ${
                      filters.activeTab === 'cnpj'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    CNPJ
                  </button>
                </div>
              </div>

              {/* Filtros Avançados */}
              {filters.activeTab === 'avancado' && (
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                  {/* CNAE */}
                  <Accordion
                    title="CNAE (Segmento)"
                    isOpen={openSections.cnae}
                    onToggle={() => setOpenSections(prev => ({ ...prev, cnae: !prev.cnae }))}
                    badge={filters.cnae ? 1 : undefined}
                  >
                    <div className="relative">
                      <input
                        ref={cnaeInputRef}
                        type="text"
                        value={filters.cnae}
                        onChange={(e) => handleCnaeChange(e.target.value)}
                        onFocus={() => filters.cnae.length >= 2 && setShowCnaeDropdown(true)}
                        placeholder="Digite código ou descrição..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {cnaeLoading && (
                        <Loader2 className="absolute right-2 top-2.5 w-4 h-4 animate-spin text-blue-600" />
                      )}

                      {showCnaeDropdown && cnaeOptions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-60 overflow-auto">
                          {cnaeOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => selectCnae(option)}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50 text-sm border-b last:border-b-0"
                            >
                              <div className="font-bold text-xs">{option.value}</div>
                              <div className="text-xs text-gray-500 truncate">{option.descricao}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <label className="flex items-center gap-2 text-xs text-gray-600 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.cnaeSecundario}
                        onChange={(e) => setFilters(prev => ({ ...prev, cnaeSecundario: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      Incluir CNAEs secundários
                    </label>
                  </Accordion>

                  {/* Localização */}
                  <Accordion
                    title="Localização"
                    isOpen={openSections.localizacao}
                    onToggle={() => setOpenSections(prev => ({ ...prev, localizacao: !prev.localizacao }))}
                    badge={(filters.uf ? 1 : 0) + (filters.cidade ? 1 : 0)}
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Estado (UF)</label>
                        <select
                          value={filters.uf}
                          onChange={(e) => setFilters(prev => ({ ...prev, uf: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="">Selecione...</option>
                          {ESTADOS_BRASILEIROS.map(estado => (
                            <option key={estado.value} value={estado.value}>{estado.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                          Cidade
                          {cidadeLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
                        </label>
                        <select
                          value={filters.cidade}
                          onChange={(e) => setFilters(prev => ({ ...prev, cidade: e.target.value }))}
                          disabled={!filters.uf || cidadeLoading}
                          className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100"
                        >
                          <option value="">
                            {!filters.uf ? 'Selecione UF primeiro...' : 'Todas as cidades'}
                          </option>
                          {cidadeOptions.map(cidade => (
                            <option key={cidade.value} value={cidade.value}>{cidade.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  {/* Situação Cadastral */}
                  <Accordion
                    title="Situação Cadastral"
                    isOpen={openSections.situacao}
                    onToggle={() => setOpenSections(prev => ({ ...prev, situacao: !prev.situacao }))}
                    badge={filters.situacaoCadastral.length}
                  >
                    <div className="space-y-1.5">
                      {SITUACOES.map(sit => (
                        <label key={sit.value} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.situacaoCadastral.includes(sit.value)}
                            onChange={() => toggleArrayFilter('situacaoCadastral', sit.value)}
                            className="rounded border-gray-300 text-blue-600"
                          />
                          {sit.label}
                        </label>
                      ))}
                    </div>
                  </Accordion>

                  {/* Remover Contadores */}
                  <div className="p-4 border-t">
                    <label className="flex items-start gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={filters.removerContadores}
                        onChange={(e) => setFilters(prev => ({ ...prev, removerContadores: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Remover contadores</div>
                        <div className="text-gray-500">Remove ~80% dos emails</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Por Segmento */}
              {filters.activeTab === 'segmento' && (
                <div className="p-4">
                  <p className="text-xs text-gray-600 mb-3">Digite o segmento de mercado</p>
                  <input
                    type="text"
                    placeholder="Ex: Restaurantes, Clínicas..."
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              )}

              {/* Por CNPJ */}
              {filters.activeTab === 'cnpj' && (
                <div className="p-4">
                  <p className="text-xs text-gray-600 mb-3">Digite o CNPJ específico</p>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    className="w-full px-3 py-2 border rounded-lg text-sm text-center"
                  />
                </div>
              )}

              {/* Botões */}
              <div className="p-4 border-t space-y-2">
                {countActiveFilters() > 0 && (
                  <button
                    onClick={limparFiltros}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Limpar filtros ({countActiveFilters()})
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Pesquisar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content: Resultados */}
          <div className="col-span-9">
            {showResults && searchResults.length > 0 ? (
              <div>
                {/* Header Resultados */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-5 shadow-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{totalResults.toLocaleString()} empresas encontradas!</h3>
                      <p className="text-blue-100 text-sm">Exibindo {searchResults.length} resultados</p>
                    </div>
                    <button className="px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-bold text-sm flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Exportar Excel
                    </button>
                  </div>
                </div>

                {/* Lista de Empresas */}
                <div className="space-y-3">
                  {searchResults.map((empresa, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                              ATIVA
                            </span>
                            <h4 className="font-bold text-gray-900">
                              {empresa.razao_social || 'Razão social não informada'}
                            </h4>
                          </div>

                          {empresa.nome_fantasia && (
                            <p className="text-sm text-gray-600 mb-2">{empresa.nome_fantasia}</p>
                          )}

                          <p className="text-xs text-gray-500 font-mono mb-2">
                            CNPJ: {empresa.cnpj_basico}-{empresa.cnpj_ordem}-{empresa.cnpj_dv}
                          </p>

                          <div className="flex gap-4 text-xs text-gray-500">
                            {empresa.municipio && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {empresa.municipio}/{empresa.uf}
                              </span>
                            )}
                            {empresa.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {empresa.email}
                              </span>
                            )}
                            {empresa.telefone1 && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                ({empresa.ddd1}) {empresa.telefone1}
                              </span>
                            )}
                          </div>
                        </div>

                        <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold text-xs ml-4 transition-all">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma pesquisa realizada</h3>
                <p className="text-gray-500">Use os filtros à esquerda para buscar empresas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}