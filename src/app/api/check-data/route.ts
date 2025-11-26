import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    const tables = ['empresas', 'estabelecimento', 'cnae', 'municipio', 'simples', 'socios']
    const counts: any = {}
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as total FROM "${table}"`)
        counts[table] = parseInt(result.rows[0].total)
      } catch (e) {
        counts[table] = 'tabela não existe'
      }
    }
    
    return NextResponse.json({
      success: true,
      counts: counts
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro' 
    }, { status: 500 })
  }
}