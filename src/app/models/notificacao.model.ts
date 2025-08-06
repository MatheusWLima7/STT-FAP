export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'ALERTA' | 'CRITICO' | 'SUCESSO';
  categoria: 'VENCIMENTO' | 'INSPECAO' | 'SERVICO' | 'SISTEMA' | 'MANUTENCAO';
  usuarioId?: number;
  lida: boolean;
  dataEnvio: Date;
  dataLeitura?: Date;
  link?: string;
  dados?: any;
}

export interface ConfiguracaoNotificacao {
  id: number;
  usuarioId: number;
  tipoNotificacao: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  antecedenciaDias: number;
  ativo: boolean;
}

export interface CreateNotificacaoRequest {
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'ALERTA' | 'CRITICO' | 'SUCESSO';
  categoria: 'VENCIMENTO' | 'INSPECAO' | 'SERVICO' | 'SISTEMA' | 'MANUTENCAO';
  usuarioId?: number;
  link?: string;
  dados?: any;
}