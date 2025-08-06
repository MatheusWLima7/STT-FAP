export interface Relatorio {
  id: number;
  titulo: string;
  tipo: 'INSPECOES' | 'EXTINTORES' | 'CONFORMIDADE' | 'PERFORMANCE' | 'GERAL';
  formato: 'PDF' | 'EXCEL' | 'FIESC';
  parametros: RelatorioParametros;
  status: 'GERANDO' | 'CONCLUIDO' | 'ERRO';
  arquivo?: string;
  dataCriacao: Date;
  criadoPor: number;
}

export interface RelatorioParametros {
  periodoInicio: Date;
  periodoFim: Date;
  unidades?: number[];
  tecnicos?: number[];
  tiposEquipamento?: string[];
  statusInspecao?: string[];
  incluirFotos?: boolean;
  incluirAssinaturas?: boolean;
}

export interface AgendamentoRelatorio {
  id: number;
  relatorioTipo: string;
  parametros: RelatorioParametros;
  periodicidade: 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL';
  destinatarios: string[];
  proximoEnvio: Date;
  ativo: boolean;
  dataCriacao: Date;
}

export interface CreateRelatorioRequest {
  titulo: string;
  tipo: 'INSPECOES' | 'EXTINTORES' | 'CONFORMIDADE' | 'PERFORMANCE' | 'GERAL';
  formato: 'PDF' | 'EXCEL' | 'FIESC';
  parametros: RelatorioParametros;
}