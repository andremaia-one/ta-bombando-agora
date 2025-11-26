'use client'

import { useState, useEffect } from 'react'
import { API } from '@/lib/api-endpoints'

interface CNAESearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCNAE: (cnae: string, descricao: string) => void
}

interface CNAE {
  codigo: string
  descricao: string
}

interface CNAECache {
  data: CNAE[]
  timestamp: number
}

// Cache expira em 24 horas
const CACHE_KEY = 'tabombando_cnaes_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas em ms

// Função para remover acentos e normalizar texto
function removeAccents(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Função para formatar código CNAE (0111301 -> 0111-3/01)
function formatCNAE(codigo: string): string {
  if (codigo.length !== 7) return codigo
  return `${codigo.substring(0, 4)}-${codigo.substring(4, 5)}/${codigo.substring(5, 7)}`
}

// Carregar do cache
function loadFromCache(): CNAE[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const parsedCache: CNAECache = JSON.parse(cached)
    const now = Date.now()

    // Verificar se cache ainda é válido
    if (now - parsedCache.timestamp < CACHE_DURATION) {
      console.log('✅ CNAEs carregados do cache (rápido!)')
      return parsedCache.data
    } else {
      console.log('⏰ Cache expirado, buscando do servidor...')
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  } catch (error) {
    console.error('Erro ao ler cache:', error)
    return null
  }
}

// Salvar no cache
function saveToCache(data: CNAE[]) {
  try {
    const cache: CNAECache = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    console.log('💾 CNAEs salvos no cache')
  } catch (error) {
    console.error('Erro ao salvar cache:', error)
  }
}

export function CNAESearchModal({ isOpen, onClose, onSelectCNAE }: CNAESearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [allCNAEs, setAllCNAEs] = useState<CNAE[]>([])
  const [filteredCNAEs, setFilteredCNAEs] = useState<CNAE[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)

  // Buscar CNAEs do Railway ou Cache quando o modal abrir
  useEffect(() => {
    if (isOpen && allCNAEs.length === 0) {
      fetchAllCNAEs()
    }
  }, [isOpen])

  // Filtrar CNAEs conforme o usuário digita (SEM ACENTOS!)
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Mostrar primeiros 200 quando não há busca (aumentamos de 50 para 200)
      setFilteredCNAEs(allCNAEs.slice(0, 200))
      return
    }

    const termNormalized = removeAccents(searchTerm)
    const filtered = allCNAEs.filter(cnae => {
      const codigoNormalized = removeAccents(cnae.codigo)
      const descricaoNormalized = removeAccents(cnae.descricao)
      
      return codigoNormalized.includes(termNormalized) ||
             descricaoNormalized.includes(termNormalized)
    })
    
    // Limitar a 200 resultados para performance
    setFilteredCNAEs(filtered.slice(0, 200))
  }, [searchTerm, allCNAEs])

  const fetchAllCNAEs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Primeiro tenta carregar do cache (RÁPIDO!)
      const cached = loadFromCache()
      
      if (cached) {
        setAllCNAEs(cached)
        setFilteredCNAEs(cached.slice(0, 200))
        setFromCache(true)
        setIsLoading(false)
        return
      }

      // Se não tem cache, busca do Railway
      setFromCache(false)
      const url = API.CONSULTA({ tabela: 'cnae', limite: 10000 })
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar CNAEs')
      }

      const data = await response.json()
      
      if (data.sucesso && data.dados) {
        setAllCNAEs(data.dados)
        setFilteredCNAEs(data.dados.slice(0, 200))
        
        // Salvar no cache para próximas vezes
        saveToCache(data.dados)
      } else {
        throw new Error('Dados inválidos retornados')
      }
    } catch (err) {
      console.error('Erro ao buscar CNAEs:', err)
      setError('Erro ao carregar CNAEs. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (cnae: CNAE) => {
    const codigoFormatado = formatCNAE(cnae.codigo)
    onSelectCNAE(codigoFormatado, cnae.descricao)
    onClose()
  }

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    setAllCNAEs([])
    setFilteredCNAEs([])
    fetchAllCNAEs()
  }

  if (!isOpen) return null

  const totalCNAEs = allCNAEs.length
  const totalFiltered = searchTerm.trim() 
    ? allCNAEs.filter(cnae => {
        const termNormalized = removeAccents(searchTerm)
        const codigoNormalized = removeAccents(cnae.codigo)
        const descricaoNormalized = removeAccents(cnae.descricao)
        return codigoNormalized.includes(termNormalized) || descricaoNormalized.includes(termNormalized)
      }).length
    : totalCNAEs

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              🔍 Buscar CNAE
              {fromCache && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-normal">
                  ⚡ Cache ativo
                </span>
              )}
            </h3>
            <p className="text-blue-100 text-sm">
              Encontre o código CNAE ideal para sua prospecção
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite: restaurante, software, agricultura, construcao (sem acento)..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-600 mt-3">
            💡 <strong>Dica:</strong> Pode digitar sem acentos! "estetica" encontra "estética" automaticamente
          </p>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[50vh] p-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Carregando CNAEs...</h4>
              <p className="text-gray-500">Buscando todos os códigos disponíveis</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar CNAEs</h4>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchAllCNAEs}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredCNAEs.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum CNAE encontrado</h4>
              <p className="text-gray-500">Tente buscar com outras palavras-chave</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                {searchTerm.trim() ? (
                  <>
                    Mostrando <strong>{Math.min(filteredCNAEs.length, 200)}</strong> de{' '}
                    <strong>{totalFiltered}</strong> CNAEs encontrados
                    {totalFiltered > 200 && ' (refine sua busca para ver mais)'}
                  </>
                ) : (
                  <>
                    Mostrando <strong>{filteredCNAEs.length}</strong> de{' '}
                    <strong>{totalCNAEs}</strong> CNAEs disponíveis
                    {' '}<span className="text-gray-400">(use a busca para filtrar)</span>
                  </>
                )}
              </p>
              {filteredCNAEs.map((cnae) => (
                <button
                  key={cnae.codigo}
                  onClick={() => handleSelect(cnae)}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-800 text-sm font-bold px-3 py-1.5 rounded-full transition-colors">
                        {formatCNAE(cnae.codigo)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 font-medium leading-relaxed">
                        {cnae.descricao}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <p className="text-gray-700">
                📊 <strong>{totalCNAEs}</strong> CNAEs no banco
              </p>
              {fromCache && (
                <button
                  onClick={clearCache}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                  title="Limpar cache e buscar dados atualizados"
                >
                  Atualizar dados
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}