export interface Servico {
  id: number;
  titulo: string;
  descricao: string;
  unidadeId: number;
  tecnicoId?: number;
  dataInicio: Date;
  dataFim?: Date;
  status: 'CRIADO' | 'DESIGNADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  tipoServico: 'INSPECAO' | 'MANUTENCAO' | 'INSTALACAO' | 'TREINAMENTO';
  episSelecionados: number[];
  medidasControle: string[];
  observacoes?: string;
  dataCriacao: Date;
  criadoPor: number;
  validado: boolean;
  assinaturas: AssinaturaServico[];
}

export interface AssinaturaServico {
  id: number;
  servicoId: number;
  usuarioId: number;
  tipoAssinatura: 'TECNICO' | 'RESPONSAVEL' | 'ADMIN';
  dataAssinatura: Date;
  assinatura: string;
}

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
}