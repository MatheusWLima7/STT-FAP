export interface EPI {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  atividades: string[];
  categoriasPerigo: string[];
  certificacao: string;
  validadeCertificacao: Date;
  fornecedor: string;
  status: 'ATIVO' | 'INATIVO';
  dataCriacao: Date;
  observacoes?: string;
}

export interface EPC {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  localizacao: string;
  unidadeId: number;
  dataInstalacao: Date;
  proximaInspecao: Date;
  status: 'ATIVO' | 'MANUTENCAO' | 'INATIVO';
  observacoes?: string;
}

export interface CreateEPIRequest {
  nome: string;
  categoria: string;
  descricao: string;
  atividades: string[];
  categoriasPerigo: string[];
  certificacao: string;
  validadeCertificacao: Date;
  fornecedor: string;
  observacoes?: string;
}