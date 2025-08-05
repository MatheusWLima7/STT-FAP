export interface DashboardMetrics {
  totalExtintores: number;
  inspecoesPendentes: number;
  usuariosAtivos: number;
  unidadesOperacionais: number;
  conformidadeGeral: number;
  alertasCriticos: number;
  servicosAtivos: number;
  documentosVencidos: number;
}

export interface AlertaCritico {
  id: number;
  tipo: 'VENCIMENTO' | 'MANUTENCAO' | 'INSPECAO' | 'DOCUMENTO' | 'SERVICO';
  descricao: string;
  unidade: string;
  dataVencimento: Date;
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  responsavel?: string;
}

export interface InspecaoPorPeriodo {
  periodo: string;
  realizadas: number;
  pendentes: number;
  atrasadas: number;
}

export interface PerformanceTecnico {
  id: number;
  nome: string;
  inspecoesRealizadas: number;
  inspecoesPendentes: number;
  mediaTempoInspecao: number;
  avaliacaoQualidade: number;
  servicosAtivos: number;
}

export interface UnidadeOperacional {
  id: number;
  nome: string;
  tipo: 'FILIAL' | 'SETOR' | 'OBRA';
  endereco: string;
  responsavel: string;
  telefone: string;
  email: string;
  status: 'ATIVA' | 'INATIVA';
  dataCriacao: Date;
  observacoes?: string;
}