'use client';

import React, { useState, useEffect } from 'react';
import { TicketForm } from '@/components/TicketForm';
import { TicketTable } from '@/components/TicketTable';
import { AssigneeModal } from '@/components/AssigneeModal';

export default function HomePage() {
  const [assignees, setAssignees] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Busca dados do banco
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAssignees, resTickets] = await Promise.all([
        fetch('/api/assignees'),
        fetch('/api/tickets'),
      ]);

      if (resAssignees.ok && resTickets.ok) {
        setAssignees(await resAssignees.json());
        setTickets(await resTickets.json());
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Controle de Tarefas & Chamados
            </h1>
            <p className="text-slate-500 text-sm">Histórico e registro das solicitações do setor</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="self-start sm:self-auto bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-md transition"
          >
            + Cadastrar Responsável
          </button>
        </div>

        {/* Componente: Formulário */}
        <TicketForm assignees={assignees} onTicketCreated={fetchData} />

        {/* Componente: Tabela de Histórico */}
        <TicketTable tickets={tickets} loading={loading} />

        {/* Componente: Modal */}
        <AssigneeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAssigneeAdded={fetchData}
        />
      </div>
    </div>
  );
}