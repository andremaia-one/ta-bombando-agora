import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    // Ver estrutura da tabela
    const estrutura = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'municipio'
      ORDER BY ordinal_position
    `)
    
    // Ver alguns exemplos do ES (código 32)
    const exemplosES = await pool.query(`
      SELECT * FROM municipio 
      WHERE codigo LIKE '32%' 
      LIMIT 10
    `)
    
    // Ver alguns exemplos da BA (código 29)  
    const exemplosBA = await pool.query(`
      SELECT * FROM municipio 
      WHERE descricao LIKE '%ADUSTINA%' OR descricao LIKE '%ANDORINHA%'
      LIMIT 5
    `)
    
    return NextResponse.json({
      success: true,
      estrutura: estrutura.rows,
      exemplosES: exemplosES.rows,
      exemplosBA: exemplosBA.rows
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro' 
    }, { status: 500 })
  }
}