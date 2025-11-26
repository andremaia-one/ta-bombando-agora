import { NextResponse } from 'next/server'

// Mock simples só para testar o front.
// Depois você troca pelo SELECT na vw_leads_base.
const MOCK_CITIES: Record<string, string[]> = {
  ES: ['VITÓRIA', 'VILA VELHA', 'SERRA', 'CARIACICA', 'LINHARES'],
  SP: ['SÃO PAULO', 'CAMPINAS', 'SANTOS', 'SOROCABA'],
  RJ: ['RIO DE JANEIRO', 'NITERÓI', 'DUQUE DE CAXIAS'],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uf = searchParams.get('uf')

  if (!uf) {
    return NextResponse.json([], { status: 200 })
  }

  const cities = MOCK_CITIES[uf.toUpperCase()] ?? []
  return NextResponse.json(cities, { status: 200 })
}
