export interface Lead {
  // Campos obrigatórios
  CNPJ: string
  EMPRESA: string
  UF: string
  CIDADE: string
  
  // Campos opcionais - usar APENAS hífen (padrão do TypeScript)
  'NATUREZA-JURIDICA'?: string
  MEI?: string
  'SIMPLES-NACIONAL'?: string
  ABERTURA?: string
  CAPITAL?: string
  'NOME-FANTASIA'?: string
  TIPO?: string
  LOGRADOURO?: string
  NUMERO?: string
  COMPLEMENTO?: string
  BAIRRO?: string
  CEP?: string
  TELEFONE?: string
  CELULAR?: string
  'PROPRIETARIO-SOCIO'?: string
  EMAIL?: string
  CARGO?: string
  CNAE?: string
  'CNAE-DESCRICAO'?: string
}

// Interface para os filtros que serão enviados à API
export interface LeadFilters {
  cnae_fiscal?: string[]
  situacao_cadastral?: string
  uf?: string
  cidades?: string[]
  data_inicio_atividades_de?: string
  data_inicio_atividades_ate?: string
  capital_social_min?: number
  capital_social_max?: number
  mei?: 'SIM' | 'NAO'
  simples_nacional?: 'SIM' | 'NAO'
  limit?: number
  offset?: number
}