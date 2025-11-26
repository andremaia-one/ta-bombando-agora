import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Remover acentos (funciona sem precisar do PostgreSQL)
function removerAcentos(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('q')
    const limit = searchParams.get('limit') || '50'

    let query: string
    let params: any[]

    if (search && search.length > 0) {
      // Normalizar busca (remover acentos) no JavaScript
      const searchNormalized = removerAcentos(search)
      
      // Buscar por código OU por descrição (case insensitive)
      query = `
        SELECT 
          codigo,
          descricao,
          codigo || ' - ' || descricao as label
        FROM cnae
        WHERE 
          codigo LIKE $1 
          OR LOWER(descricao) LIKE $2
        ORDER BY 
          CASE 
            WHEN codigo LIKE $3 THEN 1
            WHEN LOWER(descricao) LIKE $4 THEN 2
            ELSE 3
          END,
          codigo ASC
        LIMIT $5
      `
      
      const searchPattern = `%${searchNormalized}%`
      const startPattern = `${searchNormalized}%`
      
      params = [
        searchPattern,
        searchPattern,
        startPattern,
        startPattern,
        parseInt(limit)
      ]
    } else {
      query = `
        SELECT 
          codigo,
          descricao,
          codigo || ' - ' || descricao as label
        FROM cnae
        ORDER BY codigo ASC
        LIMIT $1
      `
      params = [parseInt(limit)]
    }

    const result = await pool.query(query, params)

    // Se pesquisou SEM acento, filtrar os resultados
    let cnaes = result.rows.map(row => ({
      value: row.codigo,
      label: row.label,
      descricao: row.descricao
    }))
    
    // Filtro adicional no JavaScript se necessário
    if (search && search.length > 0) {
      const searchNormalized = removerAcentos(search)
      cnaes = cnaes.filter(cnae => 
        removerAcentos(cnae.descricao).includes(searchNormalized) ||
        cnae.value.includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      total: cnaes.length,
      cnaes: cnaes,
      _source: 'database'
    })

  } catch (error) {
    console.error('Erro ao buscar CNAEs:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar CNAEs',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}