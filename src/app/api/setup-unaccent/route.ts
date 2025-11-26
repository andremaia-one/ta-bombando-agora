import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS unaccent')
    
    return NextResponse.json({
      success: true,
      message: 'Extensão unaccent ativada com sucesso!'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      success: false
    }, { status: 500 })
  }
}