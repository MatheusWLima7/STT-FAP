# 📋 Funcionalidades do Sistema STT-FAP por Perfil de Usuário

## 📖 Visão Geral

Este documento apresenta a estrutura de funcionalidades do Sistema de Segurança do Trabalho e Fiscalização de Equipamentos (STT-FAP), organizadas por perfil de acesso: **Administrador**, **Técnico** e funcionalidades **Compartilhadas**.

---

## 🔐 Perfis de Usuário

### 👨‍💼 Administrador (ADMIN)
Usuário com acesso completo ao sistema, responsável pela gestão, configuração e supervisão geral.

### 🔧 Técnico (TECNICO)
Usuário operacional responsável pela execução de inspeções e serviços de campo.

---

## 🛑 Funcionalidades Exclusivas do Administrador

### 👥 **Gestão de Usuários**
- **Cadastro de Usuário** ✅ *Implementado*
  - Definição de tipo de perfil (Admin/Técnico)
  - Configuração de permissões e unidades vinculadas
  - Upload de foto do usuário
  - Validação de CPF e dados pessoais
  - Geração automática de credenciais

### 📊 **Dashboard Administrativo**
- **Dashboard Admin** ✅ *Implementado*
  - Métricas gerais do sistema
  - Alertas críticos em tempo real
  - Performance dos técnicos
  - Gráficos de inspeções por período
  - Ações rápidas para gestão
  - Filtros avançados por período e unidade

### 🏢 **Gestão Organizacional**
- **Cadastro de Unidades Operacionais** 🔄 *Em Desenvolvimento*
  - Filiais, setores e obras
  - Definição de responsáveis
  - Configuração de endereços e contatos

- **Cadastro de Responsáveis por Unidade** 🔄 *Em Desenvolvimento*
  - Vinculação de responsáveis às unidades
  - Definição de hierarquias

### 🦺 **Gestão de Equipamentos de Proteção**
- **Cadastro de EPIs/EPCs** 🔄 *Em Desenvolvimento*
  - Seleção por atividade
  - Categorização de perigos
  - Certificações e validades

### 📋 **Gestão de Serviços**
- **Criação de Serviço** 🔄 *Em Desenvolvimento*
  - Definição de escopo e prioridade
  - Seleção de unidades

- **Seleção de Técnico para Serviço** 🔄 *Em Desenvolvimento*
  - Designação baseada em disponibilidade
  - Consideração de especialidades

- **Definição de EPIs para Serviço** 🔄 *Em Desenvolvimento*
  - Seleção obrigatória por tipo de atividade
  - Validação de disponibilidade

- **Recomendação de Medidas de Controle** 🔄 *Em Desenvolvimento*
  - Sugestões automáticas baseadas em riscos
  - Histórico de medidas eficazes

### ✅ **Validação e Controle**
- **Validação e Assinaturas** 🔄 *Em Desenvolvimento*
  - Aprovação de serviços executados
  - Assinaturas digitais
  - Controle de qualidade

### 📧 **Automação e Configuração**
- **Agendamento de Envio de Relatórios** 🔄 *Em Desenvolvimento*
  - Relatórios automáticos por e-mail
  - Configuração de periodicidade

- **Parâmetros e Configurações do Sistema** 🔄 *Em Desenvolvimento*
  - Configurações globais
  - Personalização de workflows

---

## ⚙️ Funcionalidades Exclusivas do Técnico

### 📋 **Gestão de Serviços Operacionais**
- **Visualização de Serviços Designados** 🔄 *Em Desenvolvimento*
  - Lista de serviços atribuídos
  - Detalhes de cada serviço
  - Status e prazos

- **Controle de Prorrogação e Encerramento** 🔄 *Em Desenvolvimento*
  - Solicitação de prorrogação de prazos
  - Encerramento de serviços com justificativas
  - Upload de evidências de conclusão

---

## ✔️ Funcionalidades Compartilhadas (Admin & Técnico)

### 🔐 **Autenticação e Segurança**
- **Login** ✅ *Implementado*
  - Autenticação por email e senha
  - Redirecionamento baseado no perfil
  - Controle de sessão

- **Redefinição de Senha** 🔄 *Estrutura Criada*
  - Reset por email
  - Alteração de senha logado

### 🧯 **Gestão de Extintores**
- **Cadastro de Extintores** 🔄 *Modelo Criado*
  - Registro completo de equipamentos
  - Códigos QR para identificação
  - Localização e especificações técnicas

### 📅 **Gestão de Inspeções**
- **Agenda de Inspeções** 🔄 *Em Desenvolvimento*
  - Calendário de inspeções programadas
  - Visualização por técnico/unidade

- **Alertas e Notificações** 🔄 *Estrutura Criada*
  - Vencimentos próximos
  - Inspeções em atraso
  - Notificações em tempo real

- **Checklist de Inspeção** 🔄 *Modelo Criado*
  - Interface web e mobile
  - Validação de conformidade
  - Campos obrigatórios configuráveis

- **Upload de Fotos e Observações** 🔄 *Em Desenvolvimento*
  - Evidências fotográficas
  - Observações detalhadas
  - Geolocalização automática

### 📊 **Relatórios e Análises**
- **Geração de Relatórios** 🔄 *Em Desenvolvimento*
  - Formatos PDF e FIESC
  - Relatórios personalizáveis
  - Exportação automática

- **Histórico de Inspeções** 🔄 *Em Desenvolvimento*
  - Por extintor ou unidade
  - Linha do tempo de atividades
  - Comparativos de performance

- **Painel Geral de Indicadores** 🔄 *Estrutura Criada*
  - Dashboard compartilhado
  - Métricas relevantes por perfil
  - Filtros personalizáveis

### ⏰ **Gestão de Prazos**
- **Definição de Prazo e Prorrogações** 🔄 *Em Desenvolvimento*
  - Configuração de prazos padrão
  - Solicitação de extensões
  - Aprovação de prorrogações

### 📋 **Gestão Documental**
- **Histórico de FAPs/PTs** 🔄 *Em Desenvolvimento*
  - Registro de Fichas de Análise Preliminar
  - Permissões de Trabalho
  - Controle de validades

- **PTs Abertas, Expiradas e Suspensas** 🔄 *Em Desenvolvimento*
  - Status em tempo real
  - Alertas de vencimento
  - Ações corretivas

- **Validade de Documentos Obrigatórios** 🔄 *Em Desenvolvimento*
  - Controle de certificações
  - Alertas de renovação
  - Histórico de atualizações

### 📤 **Exportação e Comunicação**
- **Filtros e Exportações** 🔄 *Em Desenvolvimento*
  - Excel, PDF e outros formatos
  - Filtros avançados
  - Agendamento de exportações

- **Notificações do Sistema** 🔄 *Estrutura Criada*
  - E-mail e SMS
  - Configuração de preferências
  - Histórico de notificações

### 🆘 **Suporte e Configuração**
- **Ajuda / Suporte / FAQ** 🔄 *Planejado*
  - Central de ajuda integrada
  - FAQ dinâmico
  - Tickets de suporte

- **Perfil e Preferências do Usuário** 🔄 *Estrutura Criada*
  - Configurações pessoais
  - Preferências de notificação
  - Histórico de atividades

---

## 📈 Status de Implementação

### ✅ **Implementado (3 funcionalidades)**
- Login com autenticação
- Cadastro completo de usuários
- Dashboard administrativo com métricas

### 🔄 **Em Desenvolvimento (8 funcionalidades)**
- Estruturas de dados criadas
- Interfaces parcialmente implementadas
- Lógica de negócio em construção

### 📋 **Planejado (15 funcionalidades)**
- Especificações definidas
- Aguardando implementação
- Dependências mapeadas

---

## 🎯 Próximas Implementações Prioritárias

1. **Cadastro de Unidades Operacionais**
2. **Gestão de Extintores (CRUD completo)**
3. **Sistema de Inspeções**
4. **Geração de Relatórios**
5. **Sistema de Notificações**

---

## 📝 Observações Técnicas

- **Framework Frontend:** Angular 19 com TypeScript
- **Arquitetura:** Componentes standalone
- **Autenticação:** JWT com controle de perfis
- **Responsividade:** Design adaptativo para mobile e desktop
- **Validações:** Formulários reativos com validação em tempo real

---

*Documento atualizado em: {{ new Date().toLocaleDateString('pt-BR') }}*
*Versão do Sistema: 1.0.0*