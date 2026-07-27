'use client';

import React, { useState, useMemo } from 'react';
import { TableFilters } from './TableFilters';
import { ExportButton } from './ExportButton';

interface Ticket {
  id: string;
  requester_name: string;
  reason: string;
  description: string;
  opened_at: string;
  assignee_id: string;
  assignee_name: string;
}

interface Assignee {
  id: string;
  name: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  assignees: Assignee[];
  loading: boolean;
}

export function TicketTable({ tickets, assignees, loading }: TicketTableProps) {
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesAssignee =
        selectedAssignee === 'ALL' || ticket.assignee_id === selectedAssignee;

      const ticketDate = new Date(ticket.opened_at);
      ticketDate.setHours(0, 0, 0, 0);

      let matchesStartDate = true;
      if (startDate) {
        const start = new Date(startDate + 'T00:00:00');
        matchesStartDate = ticketDate >= start;
      }

      let matchesEndDate = true;
      if (endDate) {
        const end = new Date(endDate + 'T00:00:00');
        matchesEndDate = ticketDate <= end;
      }

      return matchesAssignee && matchesStartDate && matchesEndDate;
    });
  }, [tickets, selectedAssignee, startDate, endDate]);

  const handleClearFilters = () => {
    setSelectedAssignee('ALL');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = selectedAssignee !== 'ALL' || startDate !== '' || endDate !== '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Histórico de Tarefas</h2>
            <p className="text-slate-500 text-xs">
              Exibindo {filteredTickets.length} de {tickets.length} tarefas salvas
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 transition"
              >
                Limpar Filtros
              </button>
            )}

            {/* Subcomponente: Botão de Exportação */}
            <ExportButton tickets={filteredTickets} isFiltered={hasActiveFilters} />
          </div>
        </div>

        {/* Subcomponente: Filtros */}
        <TableFilters
          assignees={assignees}
          selectedAssignee={selectedAssignee}
          startDate={startDate}
          endDate={endDate}
          onAssigneeChange={setSelectedAssignee}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Tabela de Dados */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Carregando chamados...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          {hasActiveFilters
            ? 'Nenhuma tarefa encontrada com os filtros selecionados.'
            : 'Nenhuma tarefa cadastrada no histórico ainda.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Data de Abertura</th>
                <th className="px-6 py-3">Solicitante</th>
                <th className="px-6 py-3">Motivo / Título</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(ticket.opened_at).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {ticket.requester_name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{ticket.reason}</td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {ticket.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {ticket.assignee_name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}