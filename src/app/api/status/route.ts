import { NextResponse } from 'next/server';

export async function GET() {
  // Um simples endpoint de status que retorna 200 OK
  return NextResponse.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  }, { status: 200 });
}