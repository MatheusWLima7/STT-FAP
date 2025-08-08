import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { CadastroUsuarioComponent } from './components/admin/cadastro-usuario/cadastro-usuario.component';
import { CadastroUnidadeComponent } from './components/admin/cadastro-unidade/cadastro-unidade.component';
import { ListaUnidadesComponent } from './components/shared/lista-unidades/lista-unidades.component';
import { CadastroExtintorComponent } from './components/shared/cadastro-extintor/cadastro-extintor.component';
import { DashboardTecnicoComponent } from './components/tecnico/dashboard-tecnico/dashboard-tecnico.component';
import { ListaUsuariosComponent } from './components/admin/lista-usuarios/lista-usuarios.component';
import { CadastroResponsavelComponent } from './components/admin/cadastro-responsavel/cadastro-responsavel.component';
import { CadastroEpiComponent } from './components/admin/cadastro-epi/cadastro-epi.component';
import { CadastroServicoComponent } from './components/admin/cadastro-servico/cadastro-servico.component';
import { ListaServicosComponent } from './components/shared/lista-servicos/lista-servicos.component';
import { ConfiguracoesComponent } from './components/admin/configuracoes/configuracoes.component';
import { ServicosDesignadosComponent } from './components/tecnico/servicos-designados/servicos-designados.component';
import { ListaExtintoresComponent } from './components/shared/lista-extintores/lista-extintores.component';
import { AgendaInspecoesComponent } from './components/shared/agenda-inspecoes/agenda-inspecoes.component';
import { ChecklistInspecaoComponent } from './components/shared/checklist-inspecao/checklist-inspecao.component';
import { RelatoriosComponent } from './components/shared/relatorios/relatorios.component';
import { HistoricoInspecoesComponent } from './components/shared/historico-inspecoes/historico-inspecoes.component';
import { DocumentosComponent } from './components/shared/documentos/documentos.component';
import { NotificacoesComponent } from './components/shared/notificacoes/notificacoes.component';
import { PerfilUsuarioComponent } from './components/shared/perfil-usuario/perfil-usuario.component';
import { AjudaComponent } from './components/shared/ajuda/ajuda.component';
import { ResetSenhaComponent } from './components/shared/reset-senha/reset-senha.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reset-senha', component: ResetSenhaComponent },
  
  // Menu principal (protegido)
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },

  // Dashboards
  { path: 'admin/dashboard', component: DashboardAdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tecnico/dashboard', component: DashboardTecnicoComponent, canActivate: [AuthGuard] },

  // Gestão de Usuários (Admin Only)
  { path: 'admin/usuarios', component: ListaUsuariosComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/usuarios/novo', component: CadastroUsuarioComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/usuarios/editar/:id', component: CadastroUsuarioComponent, canActivate: [AuthGuard, AdminGuard] },

  // Gestão de Unidades (Admin Only)
  { path: 'admin/unidades', component: ListaUnidadesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/unidades/nova', component: CadastroUnidadeComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/unidades/editar/:id', component: CadastroUnidadeComponent, canActivate: [AuthGuard, AdminGuard] },

  // Responsáveis por Unidades (Admin Only)
  { path: 'admin/responsaveis', component: CadastroResponsavelComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/responsaveis/novo', component: CadastroResponsavelComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/responsaveis/editar/:id', component: CadastroResponsavelComponent, canActivate: [AuthGuard, AdminGuard] },

  // EPIs/EPCs (Admin Only)
  { path: 'admin/epis', component: CadastroEpiComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/epis/novo', component: CadastroEpiComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/epis/editar/:id', component: CadastroEpiComponent, canActivate: [AuthGuard, AdminGuard] },

  // Serviços (Admin cria, ambos visualizam)
  { path: 'admin/servicos/novo', component: CadastroServicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/servicos/editar/:id', component: CadastroServicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'servicos', component: ListaServicosComponent, canActivate: [AuthGuard] },

  // Configurações (Admin Only)
  { path: 'admin/configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuard, AdminGuard] },

  // Serviços Designados (Técnico Only)
  { path: 'tecnico/servicos', component: ServicosDesignadosComponent, canActivate: [AuthGuard] },

  // Extintores (Ambos)
  { path: 'extintores', component: ListaExtintoresComponent, canActivate: [AuthGuard] },
  { path: 'extintores/novo', component: CadastroExtintorComponent, canActivate: [AuthGuard] },
  { path: 'extintores/editar/:id', component: CadastroExtintorComponent, canActivate: [AuthGuard] },

  // Inspeções (Ambos)
  { path: 'inspecoes', component: AgendaInspecoesComponent, canActivate: [AuthGuard] },
  { path: 'inspecoes/checklist/:id', component: ChecklistInspecaoComponent, canActivate: [AuthGuard] },
  { path: 'inspecoes/historico', component: HistoricoInspecoesComponent, canActivate: [AuthGuard] },

  // Relatórios (Ambos)
  { path: 'relatorios', component: RelatoriosComponent, canActivate: [AuthGuard] },

  // Documentos (Ambos)
  { path: 'documentos', component: DocumentosComponent, canActivate: [AuthGuard] },

  // Notificações (Ambos)
  { path: 'notificacoes', component: NotificacoesComponent, canActivate: [AuthGuard] },

  // Perfil e Configurações Pessoais (Ambos)
  { path: 'perfil', component: PerfilUsuarioComponent, canActivate: [AuthGuard] },

  // Ajuda (Ambos)
  { path: 'ajuda', component: AjudaComponent, canActivate: [AuthGuard] },

  // Redirect para dashboard baseado no perfil
  { path: '**', redirectTo: 'login' }
];