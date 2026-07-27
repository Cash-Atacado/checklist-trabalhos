'use client';

import React, { useState, useEffect } from 'react';

interface Ticket {
  requester_name: string;
  reason: string;
  description: string;
  opened_at: string;
  assignee_name: string;
}

interface ExportButtonProps {
  tickets: Ticket[];
  isFiltered: boolean;
}

export function ExportButton({ tickets, isFiltered }: ExportButtonProps) {
  // Estado para controlar a hidratação completa no cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enquanto não montou no navegador, assume desabilitado no HTML inicial
  const isDisabled = !isMounted || !tickets || tickets.length === 0;

  const handleExportCSV = () => {
    if (isDisabled) {
      alert('Não há dados para exportar.');
      return;
    }

    const headers = ['Data de Abertura', 'Solicitante', 'Motivo / Título', 'Descrição', 'Responsável'];

    const rows = tickets.map((ticket) => {
      const dataFormatada = new Date(ticket.opened_at).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });

      const descSanitizada = (ticket.description || '')
        .replace(/"/g, '""')
        .replace(/\n/g, ' ');

      return [
        `"${dataFormatada}"`,
        `"${ticket.requester_name}"`,
        `"${ticket.reason}"`,
        `"${descSanitizada}"`,
        `"${ticket.assignee_name}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dataHoje = new Date().toISOString().split('T')[0];
    const sufixoFiltro = isFiltered ? '_filtrado' : '_completo';

    link.setAttribute('href', url);
    link.setAttribute('download', `historico_tarefas_${dataHoje}${sufixoFiltro}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportCSV}
      disabled={isDisabled}
      suppressHydrationWarning
      className="inline-flex items-center gap-1.5 bg-[#045c1c] hover:bg-[#56c408] text-white text-xs font-medium px-3 py-2 rounded-lg transition disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Exportar CSV {isFiltered && '(Filtrado)'}
    </button>
  );
}