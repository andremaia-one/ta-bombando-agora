import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Cache em memória (resetar a cada 1 hora)
let cidadesCache: Record<string, any[]> = {}
let cacheTimestamp = Date.now()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora

// Mapeamento código → sigla
const UF_MAP: Record<string, string> = {
  '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA',
  '16': 'AP', '17': 'TO', '21': 'MA', '22': 'PI', '23': 'CE',
  '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE',
  '29': 'BA', '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
  '41': 'PR', '42': 'SC', '43': 'RS', '50': 'MS', '51': 'MT',
  '52': 'GO', '53': 'DF'
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uf = searchParams.get('uf')

    if (!uf) {
      return NextResponse.json(
        { error: 'Parâmetro UF é obrigatório' },
        { status: 400 }
      )
    }

    const ufSigla = UF_MAP[uf]

    if (!ufSigla) {
      return NextResponse.json(
        { error: 'Código UF inválido' },
        { status: 400 }
      )
    }

    // Limpar cache a cada 1 hora
    if (Date.now() - cacheTimestamp > CACHE_DURATION) {
      cidadesCache = {}
      cacheTimestamp = Date.now()
    }

    // Verificar cache
    if (cidadesCache[ufSigla]) {
      console.log(`✅ Cache hit para ${ufSigla}`)
      return NextResponse.json({
        success: true,
        total: cidadesCache[ufSigla].length,
        cidades: cidadesCache[ufSigla],
        _source: 'cache',
        uf: ufSigla
      })
    }

    console.log(`🔍 Buscando cidades de ${ufSigla} no banco...`)

    // Query otimizada: usar tabela municipio diretamente
    // com filtro por prefixo do código IBGE
    const prefixoIBGE: Record<string, string> = {
      'RO': '11', 'AC': '12', 'AM': '13', 'RR': '14', 'PA': '15',
      'AP': '16', 'TO': '17', 'MA': '21', 'PI': '22', 'CE': '23',
      'RN': '24', 'PB': '25', 'PE': '26', 'AL': '27', 'SE': '28',
      'BA': '29', 'MG': '31', 'ES': '32', 'RJ': '33', 'SP': '35',
      'PR': '41', 'SC': '42', 'RS': '43', 'MS': '50', 'MT': '51',
      'GO': '52', 'DF': '53'
    }

    const prefixo = prefixoIBGE[ufSigla]

    const query = `
      SELECT 
        codigo as value,
        descricao as label
      FROM municipio
      WHERE codigo LIKE $1
      ORDER BY descricao
    `

    const result = await pool.query(query, [`${prefixo}%`])

    const cidades = result.rows

    // Salvar no cache
    cidadesCache[ufSigla] = cidades

    console.log(`✅ ${cidades.length} cidades de ${ufSigla} carregadas e cacheadas`)

    return NextResponse.json({
      success: true,
      total: cidades.length,
      cidades: cidades,
      _source: 'database',
      uf: ufSigla
    })

  } catch (error) {
    console.error('❌ Erro ao buscar cidades:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar cidades',
        details: error instanceof Error ? error.message : 'Erro'
      },
      { status: 500 }
    )
  }
}