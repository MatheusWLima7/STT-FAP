import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicoService } from '../../../services/servico.service';
import { AuthService } from '../../../services/auth.service';
import { Servico } from '../../../models/servico.model';

@Component({
  selector: 'app-lista-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-servicos.component.html',
  styleUrl: './lista-servicos.component.css'
})
export class ListaServicosComponent implements OnInit {
  servicos: Servico[] = [];
  servicosFiltrados: Servico[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroTitulo: string = '';
  filtroStatus: string = '';
  filtroPrioridade: string = '';
  filtroTipo: string = '';

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'CRIADO', label: 'Criado' },
    { value: 'DESIGNADO', label: 'Designado' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ];

  prioridadeOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'CRITICA', label: 'Crítica' }
  ];

  tipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'INSPECAO', label: 'Inspeção' },
    { value: 'MANUTENCAO', label: 'Manutenção' },
    { value: 'INSTALACAO', label: 'Instalação' },
    { value: 'TREINAMENTO', label: 'Treinamento' }
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
      if (this.currentUser?.tipoUsuario === 'TECNICO') {
        this.servicos = await this.servicoService.getServicosByTecnico(this.currentUser.id).toPromise() || [];
      } else {
        this.servicos = await this.servicoService.getServicos().toPromise() || [];
      }
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
      const matchTitulo = !this.filtroTitulo || 
        servico.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase());
      
      const matchStatus = !this.filtroStatus || servico.status === this.filtroStatus;
      
      const matchPrioridade = !this.filtroPrioridade || servico.prioridade === this.filtroPrioridade;
      
      const matchTipo = !this.filtroTipo || servico.tipoServico === this.filtroTipo;

      return matchTitulo && matchStatus && matchPrioridade && matchTipo;
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
    this.filtroTitulo = '';
    this.filtroStatus = '';
    this.filtroPrioridade = '';
    this.filtroTipo = '';
    this.aplicarFiltros();
  }

  novoServico() {
    this.router.navigate(['/admin/servicos/novo']);
  }

  editarServico(id: number) {
    this.router.navigate(['/admin/servicos/editar', id]);
  }

  verDetalhes(servico: Servico) {
    this.router.navigate(['/servicos', servico.id]);
  }

  iniciarServico(servico: Servico) {
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

  concluirServico(servico: Servico) {
    if (confirm(`Concluir o serviço "${servico.titulo}"?`)) {
      this.servicoService.encerrarServico(servico.id, {
        status: 'CONCLUIDO',
        dataFim: new Date()
      }).subscribe({
        next: () => {
          this.carregarServicos();
        },
        error: (error) => {
          alert('Erro ao concluir serviço');
          console.error('Erro ao concluir serviço:', error);
        }
      });
    }
  }

  solicitarProrrogacao(servico: Servico) {
    const motivo = prompt('Motivo da prorrogação:');
    const novaData = prompt('Nova data de fim (YYYY-MM-DD):');
    
    if (motivo && novaData) {
      this.servicoService.solicitarProrrogacao(servico.id, {
        motivo,
        novaDataFim: new Date(novaData)
      }).subscribe({
        next: () => {
          alert('Solicitação de prorrogação enviada!');
          this.carregarServicos();
        },
        error: (error) => {
          alert('Erro ao solicitar prorrogação');
          console.error('Erro ao solicitar prorrogação:', error);
        }
      });
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    switch (status) {
      case 'CRIADO': return 'status-criado';
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

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isTecnico(): boolean {
    return this.authService.isTecnico();
  }
}