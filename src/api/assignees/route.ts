import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Buscar todos os responsáveis ativos para preencher o <select>
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name FROM assignees WHERE is_active = true ORDER BY name ASC'
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar responsáveis:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar responsáveis' },
      { status: 500 }
    );
  }
}

// POST: Cadastrar um novo responsável no setor
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'O nome do responsável é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO assignees (name) VALUES ($1) RETURNING id, name',
      [name.trim()]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar responsável:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar responsável' },
      { status: 500 }
    );
  }
}