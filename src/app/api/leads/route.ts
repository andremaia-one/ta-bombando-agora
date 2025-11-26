import { NextResponse } from 'next/server'

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

// Pequeno mock só para validar o front.
// Depois você troca pela vw_leads_base no Railway.
const MOCK_LEADS: Lead[] = [
  {
    cnpj_basico: '05107631',
    cnpj_ordem: '0001',
    cnpj_dv: '28',
    razao_social: 'IZABEL MENDES SOARES',
    nome_fantasia: null,
    cnae_fiscal_principal: '5611204',
    cnae_descricao:
      'Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento',
    uf: 'SP',
    municipio: 'SAO PAULO',
    email: null,
  },
  {
    cnpj_basico: '01901896',
    cnpj_ordem: '0001',
    cnpj_dv: '42',
    razao_social: 'J.LUIZ DE MACEDO',
    nome_fantasia: null,
    cnae_fiscal_principal: '5611204',
    cnae_descricao:
      'Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento',
    uf: 'SP',
    municipio: 'CRUZEIRO',
    email: 'rosimarcontabil@terra.com.br',
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const uf = (searchParams.get('uf') || '').toUpperCase()
  const cnae = searchParams.get('cnae') || ''
  const cidade = searchParams.get('cidade')
  const onlyWithEmail = searchParams.get('onlyWithEmail') === 'true'
  const limit = Number(searchParams.get('limit') || '150')

  if (!uf || !cnae) {
    return NextResponse.json({ total: 0, leads: [] }, { status: 200 })
  }

  let filtered = MOCK_LEADS.filter(
    (lead) =>
      lead.uf === uf && lead.cnae_fiscal_principal === cnae,
  )

  if (cidade && cidade !== 'all') {
    filtered = filtered.filter((lead) => lead.municipio === cidade)
  }

  if (onlyWithEmail) {
    filtered = filtered.filter((lead) => !!lead.email)
  }

  const sliced = filtered.slice(0, limit)

  return NextResponse.json(
    {
      total: filtered.length,
      leads: sliced,
    },
    { status: 200 },
  )
}
