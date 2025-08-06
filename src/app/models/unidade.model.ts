export interface UnidadeOperacional {
  id: number;
  nome: string;
  tipo: 'FILIAL' | 'SETOR' | 'OBRA';
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelId?: number;
  responsavelNome?: string;
  telefone: string;
  email: string;
  status: 'ATIVA' | 'INATIVA';
  dataCriacao: Date;
  observacoes?: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
}

export interface ResponsavelUnidade {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  unidadeId: number;
  status: 'ATIVO' | 'INATIVO';
  dataCriacao: Date;
}

export interface CreateUnidadeRequest {
  nome: string;
  tipo: 'FILIAL' | 'SETOR' | 'OBRA';
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelId?: number;
  telefone: string;
  email: string;
  observacoes?: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
}