import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    // Ver estrutura da tabela estabelecimento
    const estrutura = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'estabelecimento'
      ORDER BY ordinal_position
    `)
    
    // Ver exemplo de 1 empresa do ES
    const exemploES = await pool.query(`
      SELECT * FROM estabelecimento 
      WHERE uf = 'ES' 
      LIMIT 1
    `)
    
    return NextResponse.json({
      success: true,
      estrutura: estrutura.rows,
      exemploES: exemploES.rows[0]
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro' 
    }, { status: 500 })
  }
}