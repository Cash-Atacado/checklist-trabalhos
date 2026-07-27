'use client';

import React from 'react';

interface Assignee {
  id: string;
  name: string;
}

interface TableFiltersProps {
  assignees: Assignee[];
  selectedAssignee: string;
  startDate: string;
  endDate: string;
  onAssigneeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function TableFilters({
  assignees,
  selectedAssignee,
  startDate,
  endDate,
  onAssigneeChange,
  onStartDateChange,
  onEndDateChange,
}: TableFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Responsável
        </label>
        <select
          value={selectedAssignee}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        >
          <option value="ALL">Todos os Responsáveis</option>
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {assignee.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Data Inicial
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Data Final
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
      </div>
    </div>
  );
}