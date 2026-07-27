'use client';

import React, { useState } from 'react';

interface Assignee {
  id: string;
  name: string;
}

interface TicketFormProps {
  assignees: Assignee[];
  onTicketCreated: () => void;
}

export function TicketForm({ assignees, onTicketCreated }: TicketFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requester_name: '',
    reason: '',
    description: '',
    assignee_id: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requester_name || !formData.reason || !formData.assignee_id) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ requester_name: '', reason: '', description: '', assignee_id: '' });
        onTicketCreated();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Erro ao registrar chamado.');
      }
    } catch (error) {
      console.error('Erro ao enviar chamado:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Registrar Nova Tarefa</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Solicitante *
            </label>
            <input
              type="text"
              name="requester_name"
              placeholder="Ex: Carlos (Financeiro)"
              value={formData.requester_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Responsável (Setor) *
            </label>
            <select
              name="assignee_id"
              value={formData.assignee_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione o responsável...</option>
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Motivo / Título do Chamado *
          </label>
          <input
            type="text"
            name="reason"
            placeholder="Ex: Troca de toner da impressora"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Descrição das Atividades Realizadas
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Detalhe o que foi resolvido..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : 'Salvar no Histórico'}
          </button>
        </div>
      </form>
    </div>
  );
}