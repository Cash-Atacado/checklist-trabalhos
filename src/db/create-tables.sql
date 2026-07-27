-- 1. Extensão para IDs únicos em UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela dos Responsáveis
CREATE TABLE assignees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL, -- Permite desativar sem apagar o histórico
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Tabela do Histórico de Tarefas/Chamados
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_name VARCHAR(120) NOT NULL,      -- Digitado livremente no formulário
    reason VARCHAR(150) NOT NULL,              -- Motivo/Título
    description TEXT,                          -- Descrição detalhada
    assignee_id UUID NOT NULL,                 -- Selecionado via <select>
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Chave Estrangeira com RESTRICT (impede apagar um responsável que já tem tarefas registradas)
    CONSTRAINT fk_tickets_assignee 
        FOREIGN KEY (assignee_id) 
        REFERENCES assignees(id) 
        ON DELETE RESTRICT
);

-- 4. Índices para otimizar as buscas do histórico por responsável e data
CREATE INDEX idx_tickets_assignee_id ON tickets(assignee_id);
CREATE INDEX idx_tickets_opened_at ON tickets(opened_at DESC);