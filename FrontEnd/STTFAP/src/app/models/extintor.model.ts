export interface Extintor {
  id: number;
  codigo: string;
  tipo: 'CO2' | 'PO_QUIMICO' | 'AGUA' | 'ESPUMA' | 'HALON';
  capacidade: number;
  fabricante: string;
  dataFabricacao: Date;
  dataVencimento: Date;
  localizacao: string;
  unidadeId: number;
  status: 'ATIVO' | 'MANUTENCAO' | 'DESCARTADO';
  ultimaInspecao?: Date;
  proximaInspecao: Date;
  observacoes?: string;
  qrCode?: string;
}

export interface InspecaoExtintor {
  id: number;
  extintorId: number;
  tecnicoId: number;
  dataInspecao: Date;
  status: 'CONFORME' | 'NAO_CONFORME' | 'MANUTENCAO_NECESSARIA';
  observacoes?: string;
  fotos: string[];
  checklist: ChecklistItem[];
  assinaturaTecnico?: string;
  assinaturaResponsavel?: string;
}

export interface ChecklistItem {
  id: number;
  descricao: string;
  conforme: boolean;
  observacao?: string;
  obrigatorio: boolean;
}