'use client';

import React, { useState } from 'react';

interface AssigneeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssigneeAdded: () => void;
}

export function AssigneeModal({ isOpen, onClose, onAssigneeAdded }: AssigneeModalProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/assignees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName('');
        onAssigneeAdded();
        onClose();
      } else {
        alert('Erro ao cadastrar novo responsável.');
      }
    } catch (error) {
      console.error('Erro ao salvar responsável:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Cadastrar Novo Responsável</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Ex: Ana Souza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}