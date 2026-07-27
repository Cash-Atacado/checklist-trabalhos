import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Buscar o histórico de chamados (com o nome do responsável via JOIN)
export async function GET() {
  try {
    const query = `
      SELECT 
        t.id,
        t.requester_name,
        t.reason,
        t.description,
        t.opened_at,
        a.id AS assignee_id,
        a.name AS assignee_name
      FROM tickets t
      INNER JOIN assignees a ON t.assignee_id = a.id
      ORDER BY t.opened_at DESC;
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar histórico de chamados:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar chamados' },
      { status: 500 }
    );
  }
}

// POST: Registrar um novo chamado/tarefa
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requester_name, reason, description, assignee_id } = body;

    // Validação simples dos campos obrigatórios
    if (!requester_name || !reason || !assignee_id) {
      return NextResponse.json(
        { error: 'Solicitante, Motivo e Responsável são obrigatórios.' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO tickets (requester_name, reason, description, assignee_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, requester_name, reason, description, opened_at;
    `;

    const values = [
      requester_name.trim(),
      reason.trim(),
      description ? description.trim() : null,
      assignee_id,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar chamado:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar o chamado' },
      { status: 500 }
    );
  }
}