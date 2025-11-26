// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('[API /api/leads] Recebido:', body);

    // aqui no futuro vamos salvar no Postgres (Railway)
    // por enquanto apenas confirma que recebeu
    return NextResponse.json(
      {
        ok: true,
        message: 'Lead recebido com sucesso',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/leads] Erro ao processar JSON:', error);

    return NextResponse.json(
      {
        error: 'Erro ao processar os dados do lead',
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      route: '/api/leads',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
