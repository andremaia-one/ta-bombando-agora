'use client'

import { useState } from 'react'

interface CNAESearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCNAE: (cnae: string, descricao: string) => void
}

const CNAES_POPULARES = [
  { codigo: '0111-3/01', descricao: 'Agricultura - Cultivo de cereais' },
  { codigo: '0151-2/01', descricao: 'Pecuária - Criação de bovinos' },
  { codigo: '1011-2/01', descricao: 'Abatedouros - Frigorífico - abate de bovinos' },
  { codigo: '1091-1/01', descricao: 'Indústria de alimentos - Fabricação de produtos de panificação' },
  { codigo: '1113-5/01', descricao: 'Indústria de bebidas - Fabricação de cerveja' },
  { codigo: '1412-6/01', descricao: 'Confecções - Confecção de peças do vestuário' },
  { codigo: '1610-2/01', descricao: 'Indústria madereira - Serrarias com desdobramento de madeira' },
  { codigo: '1822-9/01', descricao: 'Indústria gráfica - Impressão de jornais' },
  { codigo: '2062-2/00', descricao: 'Indústria Química - Fabricação de produtos de limpeza' },
  { codigo: '2121-1/01', descricao: 'Indústria Farmacêutica - Fabricação de medicamentos' },
  { codigo: '2330-3/01', descricao: 'Indústria de minerais não metálicos - Fabricação de cimento' },
  { codigo: '2621-3/00', descricao: 'Indústria de eletrônicos e informática - Fabricação de computadores' },
  { codigo: '2910-7/01', descricao: 'Indústria automotiva - Fabricação de automóveis' },
  { codigo: '3101-2/00', descricao: 'Indústria de móveis - Fabricação de móveis com predominância de madeira' },
  { codigo: '3511-5/01', descricao: 'Eletricidade e gás - Geração de energia elétrica' },
  { codigo: '4120-4/00', descricao: 'Construção em geral - Construção de edifícios' },
  { codigo: '4511-1/01', descricao: 'Comércio e reparação de veículos - Automóveis novos' },
  { codigo: '4681-8/02', descricao: 'Postos de combustível' },
  { codigo: '4711-3/01', descricao: 'Minimercados, mercearias e armazéns' },
  { codigo: '4721-1/02', descricao: 'Padarias e panificadoras' },
  { codigo: '4723-7/00', descricao: 'Açougues e peixarias' },
  { codigo: '5611-2/01', descricao: 'Restaurantes e lanchonetes' },
  { codigo: '5620-1/01', descricao: 'Bares e outros estabelecimentos especializados em servir bebidas' },
  { codigo: '5510-8/01', descricao: 'Hotéis, motéis e pousadas' },
  { codigo: '6201-5/00', descricao: 'Web design - Desenvolvimento de programas de computador sob encomenda' },
  { codigo: '7020-4/00', descricao: 'Atividades de consultoria em gestão empresarial' },
  { codigo: '7111-1/00', descricao: 'Serviços de arquitetura' },
  { codigo: '7112-0/00', descricao: 'Serviços de engenharia' },
  { codigo: '8610-1/01', descricao: 'Hospitais - Atividades de atendimento hospitalar' },
  { codigo: '8121-4/00', descricao: 'Serviços de zeladoria e manutenção - Limpeza em prédios' },
  { codigo: '9602-5/01', descricao: 'Salão de beleza - Cabeleireiros' },
]

export function CNAESearchModal({ isOpen, onClose, onSelectCNAE }: CNAESearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCNAEs, setFilteredCNAEs] = useState(CNAES_POPULARES)

  if (!isOpen) return null

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredCNAEs(CNAES_POPULARES)
      return
    }

    const filtered = CNAES_POPULARES.filter(
      cnae =>
        cnae.codigo.includes(term) ||
        cnae.descricao.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredCNAEs(filtered)
  }

  const handleSelect = (cnae: typeof CNAES_POPULARES[0]) => {
    onSelectCNAE(cnae.codigo, cnae.descricao)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              🔍 Buscar CNAE
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
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Digite: restaurante, software, agricultura, construção..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-600 mt-3">
            💡 <strong>Dica:</strong> Pesquise por palavras-chave do seu segmento ou pelo código CNAE
          </p>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[50vh] p-6">
          {filteredCNAEs.length === 0 ? (
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
                <strong>{filteredCNAEs.length}</strong> CNAEs encontrados
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
                        {cnae.codigo}
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
            <p className="text-gray-700">
              📊 <strong>{CNAES_POPULARES.length}</strong> CNAEs disponíveis
            </p>
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