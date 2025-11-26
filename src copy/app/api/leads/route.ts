import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Pool de conexão com o Postgres da Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // evita erro de SSL em alguns ambientes
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nome,
      email,
      telefone,
      segmento,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      fbclid,
      gclid,
    } = body as {
      nome: string;
      email: string;
      telefone: string;
      segmento: string;
      utm_source?: string | null;
      utm_medium?: string | null;
      utm_campaign?: string | null;
      utm_content?: string | null;
      fbclid?: string | null;
      gclid?: string | null;
    };

    // Validação básica
    if (!nome || !email || !telefone || !segmento) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando.' },
        { status: 400 }
      );
    }

    // 1) Verifica se já existe lead com mesmo email ou telefone
    const checkQuery = `
      SELECT id 
      FROM leads 
      WHERE email = $1 OR telefone = $2
      LIMIT 1
    `;
    const checkResult = await pool.query(checkQuery, [email, telefone]);

    if (checkResult.rowCount && checkResult.rowCount > 0) {
      // Já existe → devolve 409 para o front mostrar mensagem de duplicidade
      return NextResponse.json(
        { error: 'Lead já cadastrado.' },
        { status: 409 }
      );
    }

    // 2) Insere o lead
    const insertQuery = `
      INSERT INTO leads (
        nome,
        email,
        telefone,
        segmento,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        fbclid,
        gclid,
        created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW()
      )
      RETURNING id
    `;

    const values = [
      nome,
      email,
      telefone,
      segmento,
      utm_source ?? null,
      utm_medium ?? null,
      utm_campaign ?? null,
      utm_content ?? null,
      fbclid ?? null,
      gclid ?? null,
    ];

    const insertResult = await pool.query(insertQuery, values);

    const leadId = insertResult.rows[0]?.id;

    return NextResponse.json(
      {
        success: true,
        id: leadId,
        message: 'Lead salvo com sucesso.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Erro na API /api/leads:', err);

    // Caso estoure UNIQUE de email/telefone no banco
    if (err?.code === '23505') {
      return NextResponse.json(
        { error: 'Lead já cadastrado.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno ao salvar o lead.' },
      { status: 500 }
    );
  }
}

// (Opcional) GET para testar rapidamente se a API está no ar
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, telefone, segmento, created_at FROM leads ORDER BY id DESC LIMIT 10'
    );

    return NextResponse.json(
      {
        count: result.rowCount,
        leads: result.rows,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erro ao listar leads:', err);
    return NextResponse.json(
      { error: 'Erro ao listar leads.' },
      { status: 500 }
    );
  }
}
