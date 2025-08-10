import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicoService } from '../../../services/servico.service';
import { AuthService } from '../../../services/auth.service';
import { Servico } from '../../../models/servico.model';

@Component({
  selector: 'app-servicos-designados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos-designados.component.html',
  styleUrl: './servicos-designados.component.css'
})
export class ServicosDesignadosComponent implements OnInit {
  servicos: Servico[] = [];
  servicosFiltrados: Servico[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroStatus: string = '';
  filtroPrioridade: string = '';

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'DESIGNADO', label: 'Designado' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' }
  ];

  prioridadeOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'CRITICA', label: 'Crítica' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'BAIXA', label: 'Baixa' }
  ];

  currentUser: any;

  constructor(
    private servicoService: ServicoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.carregarServicos();
  }

  async carregarServicos() {
    this.loading = true;
    this.error = '';

    try {
      this.servicos = await this.servicoService.getServicosByTecnico(this.currentUser.id).toPromise() || [];
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'Erro ao carregar serviços';
      console.error('Erro ao carregar serviços:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros() {
    this.servicosFiltrados = this.servicos.filter(servico => {
      const matchStatus = !this.filtroStatus || servico.status === this.filtroStatus;
      const matchPrioridade = !this.filtroPrioridade || servico.prioridade === this.filtroPrioridade;
      return matchStatus && matchPrioridade;
    });

    // Ordenar por prioridade e data
    this.servicosFiltrados.sort((a, b) => {
      const prioridadeOrder = { 'CRITICA': 4, 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
      const prioridadeA = prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder] || 0;
      const prioridadeB = prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] || 0;
      
      if (prioridadeA !== prioridadeB) {
        return prioridadeB - prioridadeA;
      }
      
      return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime();
    });
  }

  limparFiltros() {
    this.filtroStatus = '';
    this.filtroPrioridade = '';
    this.aplicarFiltros();
  }

  iniciarServico(servico: Servico) {
    if (confirm(`Iniciar o serviço "${servico.titulo}"?`)) {
      this.servicoService.updateServico(servico.id, {
        status: 'EM_ANDAMENTO'
      }).subscribe({
        next: () => {
          this.carregarServicos();
        },
        error: (error) => {
          alert('Erro ao iniciar serviço');
          console.error('Erro ao iniciar serviço:', error);
        }
      });
    }
  }

  solicitarProrrogacao(servico: Servico) {
    const motivo = prompt('Motivo da prorrogação:');
    const diasAdicionais = prompt('Quantos dias adicionais?');
    
    if (motivo && diasAdicionais) {
      const novaDataFim = new Date(servico.dataFim!);
      novaDataFim.setDate(novaDataFim.getDate() + parseInt(diasAdicionais));
      
      this.servicoService.solicitarProrrogacao(servico.id, {
        motivo,
        diasAdicionais: parseInt(diasAdicionais),
        novaDataFim
      }).subscribe({
        next: () => {
          alert('Solicitação de prorrogação enviada para aprovação!');
          this.carregarServicos();
        },
        error: (error) => {
          alert('Erro ao solicitar prorrogação');
          console.error('Erro ao solicitar prorrogação:', error);
        }
      });
    }
  }

  encerrarServico(servico: Servico) {
    const observacoes = prompt('Observações sobre a conclusão do serviço:');
    
    if (observacoes !== null) {
      this.servicoService.encerrarServico(servico.id, {
        status: 'CONCLUIDO',
        dataFim: new Date(),
        observacoesConclusao: observacoes
      }).subscribe({
        next: () => {
          alert('Serviço encerrado com sucesso!');
          this.carregarServicos();
        },
        error: (error) => {
          alert('Erro ao encerrar serviço');
          console.error('Erro ao encerrar serviço:', error);
        }
      });
    }
  }

  verDetalhes(servico: Servico) {
    this.router.navigate(['/servicos', servico.id]);
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    switch (status) {
      case 'DESIGNADO': return 'status-designado';
      case 'EM_ANDAMENTO': return 'status-andamento';
      case 'CONCLUIDO': return 'status-concluido';
      case 'CANCELADO': return 'status-cancelado';
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

  verificarAtraso(dataFim: Date): boolean {
    if (!dataFim) return false;
    const hoje = new Date();
    const fim = new Date(dataFim);
    return fim < hoje;
  }

  calcularDiasRestantes(dataFim: Date): number {
    if (!dataFim) return 0;
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}