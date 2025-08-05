export interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoUsuario: 'ADMIN' | 'TECNICO';
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  foto?: string;
  cargo?: string;
  dataAdmissao?: Date;
  unidadesVinculadas: number[];
  observacoes?: string;
  dataCriacao: Date;
  dataUltimoLogin?: Date;
}

export interface CreateUserRequest {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoUsuario: 'ADMIN' | 'TECNICO';
  cargo?: string;
  dataAdmissao?: Date;
  unidadesVinculadas: number[];
  observacoes?: string;
}