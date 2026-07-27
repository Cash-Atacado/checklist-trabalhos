import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Buscar histórico de chamados (com o nome do responsável via JOIN)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id,
        requester_name,
        reason,
        description,
        opened_at,
        assignee_id,
        assignees!inner (
          id,
          name
        )
      `)
      .order('opened_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Mapeia para manter o mesmo formato plano que o seu frontend já espera
    const formattedTickets = data.map((ticket: any) => ({
      id: ticket.id,
      requester_name: ticket.requester_name,
      reason: ticket.reason,
      description: ticket.description,
      opened_at: ticket.opened_at,
      assignee_id: ticket.assignee_id,
      assignee_name: ticket.assignees?.name || 'Não informado',
    }));

    return NextResponse.json(formattedTickets, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar histórico de chamados:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar chamados' },
      { status: 500 }
    );
  }
}

// POST: Registrar um novo chamado
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requester_name, reason, description, assignee_id } = body;

    if (!requester_name || !reason || !assignee_id) {
      return NextResponse.json(
        { error: 'Solicitante, Motivo e Responsável são obrigatórios.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Captura o usuário logado via cookie para salvar o user_id automaticamente
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          requester_name: requester_name.trim(),
          reason: reason.trim(),
          description: description ? description.trim() : null,
          assignee_id,
          user_id: user?.id || null, // Atribui o ID do usuário logado no Supabase Auth
        },
      ])
      .select('id, requester_name, reason, description, opened_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar chamado:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar o chamado' },
      { status: 500 }
    );
  }
}