import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InspecaoService } from '../../../services/inspecao.service';
import { AuthService } from '../../../services/auth.service';
import { AgendaInspecao, Inspecao } from '../../../models/inspecao.model';

@Component({
  selector: 'app-agenda-inspecoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-inspecoes.component.html',
  styleUrl: './agenda-inspecoes.component.css'
})
export class AgendaInspecoesComponent implements OnInit {
  inspecoes: Inspecao[] = [];
  inspecoesFiltradas: Inspecao[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroStatus: string = '';
  filtroData: string = '';
  filtroTecnico: string = '';

  // Visualização
  visualizacao: 'lista' | 'calendario' = 'lista';
  
  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'AGENDADA', label: 'Agendada' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDA', label: 'Concluída' },
    { value: 'ATRASADA', label: 'Atrasada' },
    { value: 'CANCELADA', label: 'Cancelada' }
  ];

  currentUser: any;

  constructor(
    private inspecaoService: InspecaoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.carregarInspecoes();
  }

  async carregarInspecoes() {
    this.loading = true;
    this.error = '';

    try {
      if (this.currentUser?.tipoUsuario === 'TECNICO') {
        this.inspecoes = await this.inspecaoService.getInspecoesByTecnico(this.currentUser.id).toPromise() || [];
      } else {
        this.inspecoes = await this.inspecaoService.getInspecoes().toPromise() || [];
      }
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'Erro ao carregar inspeções';
      console.error('Erro ao carregar inspeções:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros() {
    this.inspecoesFiltradas = this.inspecoes.filter(inspecao => {
      const matchStatus = !this.filtroStatus || inspecao.status === this.filtroStatus;
      
      const matchData = !this.filtroData || 
        new Date(inspecao.dataAgendada).toDateString() === new Date(this.filtroData).toDateString();
      
      const matchTecnico = !this.filtroTecnico || 
        (inspecao.tecnicoNome && inspecao.tecnicoNome.toLowerCase().includes(this.filtroTecnico.toLowerCase()));

      return matchStatus && matchData && matchTecnico;
    });

    // Ordenar por data
    this.inspecoesFiltradas.sort((a, b) => 
      new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime()
    );
  }

  limparFiltros() {
    this.filtroStatus = '';
    this.filtroData = '';
    this.filtroTecnico = '';
    this.aplicarFiltros();
  }

  novaInspecao() {
    this.router.navigate(['/inspecoes/nova']);
  }

  editarInspecao(id: number) {
    this.router.navigate(['/inspecoes/editar', id]);
  }

  realizarInspecao(inspecao: Inspecao) {
    this.router.navigate(['/inspecoes/checklist', inspecao.id]);
  }

  reagendarInspecao(inspecao: Inspecao) {
    // Implementar modal de reagendamento
    const novaData = prompt('Nova data (YYYY-MM-DD):', 
      new Date(inspecao.dataAgendada).toISOString().split('T')[0]);
    
    if (novaData) {
      this.inspecaoService.updateInspecao(inspecao.id, {
        dataAgendada: new Date(novaData),
        status: 'REAGENDADA'
      }).subscribe({
        next: () => {
          this.carregarInspecoes();
        },
        error: (error) => {
          alert('Erro ao reagendar inspeção');
          console.error('Erro ao reagendar:', error);
        }
      });
    }
  }

  cancelarInspecao(inspecao: Inspecao) {
    if (confirm(`Cancelar inspeção do extintor ${inspecao.extintorCodigo}?`)) {
      this.inspecaoService.updateInspecao(inspecao.id, {
        status: 'CANCELADA'
      }).subscribe({
        next: () => {
          this.carregarInspecoes();
        },
        error: (error) => {
          alert('Erro ao cancelar inspeção');
          console.error('Erro ao cancelar:', error);
        }
      });
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarDataHora(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    switch (status) {
      case 'AGENDADA': return 'status-agendada';
      case 'EM_ANDAMENTO': return 'status-andamento';
      case 'CONCLUIDA': return 'status-concluida';
      case 'ATRASADA': return 'status-atrasada';
      case 'CANCELADA': return 'status-cancelada';
      default: return '';
    }
  }

  verificarAtraso(dataAgendada: Date): boolean {
    const hoje = new Date();
    const agendada = new Date(dataAgendada);
    return agendada < hoje;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}