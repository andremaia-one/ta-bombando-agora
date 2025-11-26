import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    // Contar total de estabelecimentos
    const countResult = await pool.query('SELECT COUNT(*) as total FROM estabelecimento')
    const total = parseInt(countResult.rows[0].total)

    // Pegar 5 exemplos do ES
    const exemplosES = await pool.query(`
      SELECT 
        cnpj_basico,
        cnpj_ordem,
        cnpj_dv,
        nome_fantasia,
        uf,
        municipio
      FROM estabelecimento 
      WHERE uf = 'ES' 
      LIMIT 5
    `)

    // Ver estrutura da coluna municipio
    const estrutura = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'estabelecimento' 
        AND column_name IN ('uf', 'municipio')
    `)

    // Contar quantos estabelecimentos do ES
    const countES = await pool.query(`
      SELECT COUNT(*) as total 
      FROM estabelecimento 
      WHERE uf = 'ES'
    `)

    // Ver cidades únicas do ES
    const cidadesES = await pool.query(`
      SELECT DISTINCT municipio 
      FROM estabelecimento 
      WHERE uf = 'ES' 
        AND municipio IS NOT NULL
      ORDER BY municipio
      LIMIT 10
    `)

    return NextResponse.json({
      success: true,
      totalEstabelecimentos: total,
      totalEstabelecimentosES: parseInt(countES.rows[0].total),
      estruturaColunas: estrutura.rows,
      exemplosES: exemplosES.rows,
      cidadesES: cidadesES.rows
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}