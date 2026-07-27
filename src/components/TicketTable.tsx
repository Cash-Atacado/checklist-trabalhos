'use client';

import React from 'react';

interface Ticket {
  id: string;
  requester_name: string;
  reason: string;
  description: string;
  opened_at: string;
  assignee_name: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
}

export function TicketTable({ tickets, loading }: TicketTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Histórico de Tarefas</h2>
        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          Total: {tickets.length}
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Carregando chamados...</div>
      ) : tickets.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          Nenhuma tarefa cadastrada no histórico ainda.
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
              {tickets.map((ticket) => (
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