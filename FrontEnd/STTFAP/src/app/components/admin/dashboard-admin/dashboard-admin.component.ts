import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { DashboardMetrics, AlertaCritico, InspecaoPorPeriodo, PerformanceTecnico } from '../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  metrics: DashboardMetrics = {
    totalExtintores: 0,
    inspecoesPendentes: 0,
    usuariosAtivos: 0,
    unidadesOperacionais: 0,
    conformidadeGeral: 0,
    alertasCriticos: 0,
    servicosAtivos: 0,
    documentosVencidos: 0
  };

  alertasCriticos: AlertaCritico[] = [];
  inspecoesPorPeriodo: InspecaoPorPeriodo[] = [];
  performanceTecnicos: PerformanceTecnico[] = [];

  // Filtros
  periodoInicio: string = '';
  periodoFim: string = '';
  unidadesSelecionadas: number[] = [];
  tiposEquipamento: string[] = [];
  statusConformidade: boolean = true;

  // Estados da interface
  carregandoDados: boolean = false;
  erroCarregamento: string = '';
  ultimaAtualizacao: Date = new Date();

  // Subscriptions
  private updateSubscription?: Subscription;

  // Opções para filtros
  unidadesDisponiveis: any[] = [];
  tiposEquipamentoDisponiveis: string[] = [
    'Extintor CO2',
    'Extintor Pó Químico',
    'Extintor Água',
    'Extintor Espuma',
    'Hidrante',
    'Mangueira'
  ];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.definirPeriodoPadrao();
  }

  ngOnInit() {
    this.carregarDadosIniciais();
    this.configurarAtualizacaoAutomatica();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  definirPeriodoPadrao() {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    
    this.periodoFim = hoje.toISOString().split('T')[0];
    this.periodoInicio = trintaDiasAtras.toISOString().split('T')[0];
  }

  async carregarDadosIniciais() {
    this.carregandoDados = true;
    this.erroCarregamento = '';

    try {
      const filtros = this.construirParametrosFiltro();
      
      const [metrics, alertas, inspecoes, performance] = await Promise.all([
        this.dashboardService.getMetrics(filtros).toPromise(),
        this.dashboardService.getAlertasCriticos().toPromise(),
        this.dashboardService.getInspecoesPorPeriodo(filtros).toPromise(),
        this.dashboardService.getPerformanceTecnicos(filtros).toPromise()
      ]);

      this.metrics = metrics || this.metrics;
      this.alertasCriticos = (alertas || []).slice(0, 10);
      this.inspecoesPorPeriodo = inspecoes || [];
      this.performanceTecnicos = performance || [];

    } catch (error) {
      this.erroCarregamento = 'Erro ao carregar dados do dashboard';
      console.error('Erro no dashboard:', error);
    } finally {
      this.carregandoDados = false;
      this.ultimaAtualizacao = new Date();
    }
  }

  construirParametrosFiltro(): any {
    return {
      periodoInicio: this.periodoInicio,
      periodoFim: this.periodoFim,
      unidades: this.unidadesSelecionadas.join(','),
      tiposEquipamento: this.tiposEquipamento.join(','),
      statusConformidade: this.statusConformidade
    };
  }

  aplicarFiltros() {
    if (!this.validarFiltros()) {
      return;
    }
    this.carregarDadosIniciais();
  }

  validarFiltros(): boolean {
    if (this.periodoInicio && this.periodoFim) {
      const inicio = new Date(this.periodoInicio);
      const fim = new Date(this.periodoFim);
      
      if (inicio > fim) {
        alert('Data de início deve ser anterior à data de fim');
        return false;
      }
      
      const diffAnos = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (diffAnos > 2) {
        alert('Período máximo de consulta é de 2 anos');
        return false;
      }
    }
    return true;
  }

  limparFiltros() {
    this.definirPeriodoPadrao();
    this.unidadesSelecionadas = [];
    this.tiposEquipamento = [];
    this.statusConformidade = true;
    this.carregarDadosIniciais();
  }

  configurarAtualizacaoAutomatica() {
    this.updateSubscription = interval(15 * 60 * 1000).subscribe(() => {
      this.carregarDadosIniciais();
    });
  }

  exportarDashboard(formato: 'PDF' | 'EXCEL') {
    const filtros = this.construirParametrosFiltro();
    
    this.dashboardService.exportarDashboard(formato, filtros).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-admin-${new Date().toISOString().split('T')[0]}.${formato.toLowerCase()}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao exportar dashboard:', error);
        alert('Erro ao exportar dashboard');
      }
    });
  }

  navegarPara(rota: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([rota], { queryParams: parametros });
    } else {
      this.router.navigate([rota]);
    }
  }

  obterClasseAlerta(prioridade: string): string {
    switch (prioridade) {
      case 'ALTA': return 'alerta-alta';
      case 'MEDIA': return 'alerta-media';
      case 'BAIXA': return 'alerta-baixa';
      default: return '';
    }
  }

  obterCorConformidade(percentual: number): string {
    if (percentual >= 90) return '#28a745';
    if (percentual >= 70) return '#ffc107';
    return '#dc3545';
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarTempo(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  }

  obterIconeAlerta(tipo: string): string {
    switch (tipo) {
      case 'VENCIMENTO': return '⏰';
      case 'MANUTENCAO': return '🔧';
      case 'INSPECAO': return '🔍';
      case 'DOCUMENTO': return '📄';
      case 'SERVICO': return '⚠️';
      default: return '❗';
    }
  }
}