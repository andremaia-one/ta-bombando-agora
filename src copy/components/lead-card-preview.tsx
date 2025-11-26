import { Lead } from '@/types/lead'

interface LeadPreviewProps {
  lead: Lead
}

export function LeadCardPreview({ lead }: LeadPreviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      
      {/* Header - Nome da Empresa */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h3 className="font-bold text-lg text-white truncate">
          {lead['NOME-FANTASIA'] || lead.EMPRESA}
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          {lead.EMPRESA}
        </p>
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        
        {/* Seção 1: Identificação */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
            </svg>
            Identificação
          </h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">CNPJ:</span>
              <p className="font-mono font-semibold text-gray-900">{lead.CNPJ}</p>
            </div>
            <div>
              <span className="text-gray-500">Abertura:</span>
              <p className="font-semibold text-gray-900">{lead.ABERTURA || 'N/A'}</p>
            </div>
          </div>

          <div>
            <span className="text-gray-500 text-xs">Natureza Jurídica:</span>
            <p className="font-semibold text-gray-900 text-sm">
              {lead['NATUREZA-JURIDICA'] || 'Não informado'}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {lead.MEI === 'SIM' && (
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                MEI
              </span>
            )}
            {lead['SIMPLES-NACIONAL'] === 'SIM' && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                Simples Nacional
              </span>
            )}
            {lead.CAPITAL && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                Capital: R$ {lead.CAPITAL}
              </span>
            )}
          </div>
        </div>

        {/* Seção 2: CNAE */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Atividade Econômica
          </h4>
          
          <div className="mb-2">
            <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              CNAE: {lead.CNAE || 'N/A'}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {lead['CNAE-DESCRICAO'] || 'Descrição não disponível'}
          </p>
        </div>

        {/* Seção 3: Localização */}
        <div className="bg-green-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            Localização
          </h4>
          
          <div className="text-sm space-y-1">
            <p className="font-semibold text-gray-900">
              {lead.TIPO && `${lead.TIPO} `}
              {lead.LOGRADOURO}
              {lead.NUMERO && `, ${lead.NUMERO}`}
            </p>
            {lead.COMPLEMENTO && (
              <p className="text-gray-600">{lead.COMPLEMENTO}</p>
            )}
            <p className="text-gray-700">
              {lead.BAIRRO && `${lead.BAIRRO} - `}
              <strong>{lead.CIDADE}/{lead.UF}</strong>
            </p>
            {lead.CEP && (
              <p className="text-gray-600 font-mono">CEP: {lead.CEP}</p>
            )}
          </div>
        </div>

        {/* Seção 4: Contatos BLOQUEADOS */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            Contatos (Bloqueados)
          </h4>

          {/* Telefones */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span className="text-gray-400 blur-sm select-none">(XX) XXXX-XXXX</span>
          </div>

          {/* Celular */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span className="text-gray-400 blur-sm select-none">(XX) 9XXXX-XXXX</span>
            <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">WhatsApp</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span className="text-gray-400 blur-sm select-none">contato@empresa.com.br</span>
          </div>

          {/* Sócio */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-400 blur-sm select-none">Nome do Sócio/Proprietário</span>
          </div>

          {/* Cargo */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
            </svg>
            <span className="text-gray-400 blur-sm select-none">Cargo do Decisor</span>
          </div>

          {/* Aviso */}
          <div className="bg-white border border-orange-300 rounded p-3 mt-3">
            <p className="text-xs text-orange-800 font-semibold text-center">
              🔓 Libere os dados completos para começar a prospectar
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}