import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Buscar todos os responsáveis ativos
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assignees')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar responsáveis:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar responsáveis' },
      { status: 500 }
    );
  }
}

// POST: Cadastrar um novo responsável
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'O nome do responsável é obrigatório.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assignees')
      .insert([{ name: name.trim() }])
      .select('id, name')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar responsável:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar responsável' },
      { status: 500 }
    );
  }
}