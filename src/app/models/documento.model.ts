export interface Documento {
  id: number;
  titulo: string;
  tipo: 'FAP' | 'PT' | 'CERTIFICADO' | 'LAUDO' | 'OUTROS';
  numero: string;
  dataEmissao: Date;
  dataVencimento?: Date;
  status: 'VIGENTE' | 'VENCIDO' | 'SUSPENSO' | 'CANCELADO';
  unidadeId: number;
  responsavelId?: number;
  arquivo?: string;
  observacoes?: string;
  dataCriacao: Date;
}

export interface PermissaoTrabalho {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  unidadeId: number;
  responsavelId: number;
  dataInicio: Date;
  dataFim: Date;
  status: 'ABERTA' | 'SUSPENSA' | 'ENCERRADA' | 'EXPIRADA';
  riscos: string[];
  medidasControle: string[];
  episObrigatorios: number[];
  observacoes?: string;
  dataCriacao: Date;
}

export interface CreateDocumentoRequest {
  titulo: string;
  tipo: 'FAP' | 'PT' | 'CERTIFICADO' | 'LAUDO' | 'OUTROS';
  numero: string;
  dataEmissao: Date;
  dataVencimento?: Date;
  unidadeId: number;
  responsavelId?: number;
  observacoes?: string;
}