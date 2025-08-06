import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ServicoService } from '../../../services/servico.service';
import { InspecaoService } from '../../../services/inspecao.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { Servico } from '../../../models/servico.model';
import { Inspecao } from '../../../models/inspecao.model';
import { Notificacao } from '../../../models/notificacao.model';

@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-tecnico.component.html',
  styleUrl: './dashboard-tecnico.component.css'
})
export class DashboardTecnicoComponent implements OnInit {
  tecnicoId: number = 0;
  tecnicoNome: string = '';
  
  // Métricas
  metrics = {
    servicosDesignados: 0,
    servicosEmAndamento: 0,
    servicosConcluidos: 0,
    inspecoesPendentes: 0,
    inspecoesRealizadas: 0,
    alertasAtivos: 0
  };

  // Dados
  servicosRecentes: Servico[] = [];
  inspecoesPendentes: Inspecao[] = [];
  notificacoes: Notificacao[] = [];
  
  // Estados
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private servicoService: ServicoService,
    private inspecaoService: InspecaoService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {
    const user = this.authService.currentUserValue;
    if (user) {
      this.tecnicoId = user.id;
      this.tecnicoNome = user.nome;
    }
  }

  ngOnInit() {
    this.carregarDashboard();
  }

  async carregarDashboard() {
    this.loading = true;
    this.error = '';

    try {
      await Promise.all([
        this.carregarServicos(),
        this.carregarInspecoes(),
        this.carregarNotificacoes()
      ]);
      
      this.calcularMetricas();
    } catch (error) {
      this.error = 'Erro ao carregar dados do dashboard';
      console.error('Erro no dashboard técnico:', error);
    } finally {
      this.loading = false;
    }
  }

  async carregarServicos() {
    try {
      const servicos = await this.servicoService.getServicosByTecnico(this.tecnicoId).toPromise();
      this.servicosRecentes = (servicos || []).slice(0, 5);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  }

  async carregarInspecoes() {
    try {
      const inspecoes = await this.inspecaoService.getInspecoesByTecnico(this.tecnicoId).toPromise();
      this.inspecoesPendentes = (inspecoes || [])
        .filter(i => i.status === 'AGENDADA' || i.status === 'ATRASADA')
        .slice(0, 5);
    } catch (error) {
      console.error('Erro ao carregar inspeções:', error);
    }
  }

  async carregarNotificacoes() {
    try {
      const notificacoes = await this.notificacaoService.getNotificacoesNaoLidas().toPromise();
      this.notificacoes = (notificacoes || []).slice(0, 5);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  calcularMetricas() {
    this.metrics.servicosDesignados = this.servicosRecentes.filter(s => s.status === 'DESIGNADO').length;
    this.metrics.servicosEmAndamento = this.servicosRecentes.filter(s => s.status === 'EM_ANDAMENTO').length;
    this.metrics.servicosConcluidos = this.servicosRecentes.filter(s => s.status === 'CONCLUIDO').length;
    this.metrics.inspecoesPendentes = this.inspecoesPendentes.length;
    this.metrics.alertasAtivos = this.notificacoes.filter(n => n.tipo === 'ALERTA' || n.tipo === 'CRITICO').length;
  }

  iniciarServico(servico: Servico) {
    this.router.navigate(['/servicos', servico.id, 'executar']);
  }

  realizarInspecao(inspecao: Inspecao) {
    this.router.navigate(['/inspecoes', inspecao.id, 'executar']);
  }

  solicitarProrrogacao(servico: Servico) {
    this.router.navigate(['/servicos', servico.id, 'prorrogar']);
  }

  marcarNotificacaoLida(notificacao: Notificacao) {
    this.notificacaoService.marcarComoLida(notificacao.id).subscribe({
      next: () => {
        notificacao.lida = true;
        if (notificacao.link) {
          this.router.navigate([notificacao.link]);
        }
      },
      error: (error) => {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    });
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarDataHora(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    switch (status) {
      case 'DESIGNADO': return 'status-designado';
      case 'EM_ANDAMENTO': return 'status-andamento';
      case 'CONCLUIDO': return 'status-concluido';
      case 'AGENDADA': return 'status-agendada';
      case 'ATRASADA': return 'status-atrasada';
      default: return '';
    }
  }

  obterClassePrioridade(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return 'prioridade-critica';
      case 'ALTA': return 'prioridade-alta';
      case 'MEDIA': return 'prioridade-media';
      case 'BAIXA': return 'prioridade-baixa';
      default: return '';
    }
  }

  obterIconeNotificacao(tipo: string): string {
    switch (tipo) {
      case 'CRITICO': return '🚨';
      case 'ALERTA': return '⚠️';
      case 'INFO': return 'ℹ️';
      case 'SUCESSO': return '✅';
      default: return '📢';
    }
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }
}