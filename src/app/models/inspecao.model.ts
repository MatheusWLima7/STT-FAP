export interface Inspecao {
  id: number;
  extintorId: number;
  extintorCodigo?: string;
  tecnicoId: number;
  tecnicoNome?: string;
  unidadeId: number;
  unidadeNome?: string;
  dataAgendada: Date;
  dataRealizada?: Date;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'ATRASADA';
  resultado?: 'CONFORME' | 'NAO_CONFORME' | 'MANUTENCAO_NECESSARIA';
  observacoes?: string;
  fotos: string[];
  checklist: ChecklistInspecao[];
  assinaturaTecnico?: string;
  assinaturaResponsavel?: string;
  proximaInspecao?: Date;
  dataCriacao: Date;
}

export interface ChecklistInspecao {
  id: number;
  item: string;
  conforme: boolean;
  observacao?: string;
  obrigatorio: boolean;
  categoria: string;
}

export interface AgendaInspecao {
  id: number;
  extintorId: number;
  tecnicoId: number;
  dataAgendada: Date;
  status: 'AGENDADA' | 'REAGENDADA' | 'CANCELADA';
  observacoes?: string;
  dataCriacao: Date;
}

export interface CreateInspecaoRequest {
  extintorId: number;
  tecnicoId: number;
  dataAgendada: Date;
  observacoes?: string;
}