import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UnidadeService } from '../../../services/unidade.service';
import { UnidadeOperacional } from '../../../models/unidade.model';

@Component({
  selector: 'app-lista-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-unidades.component.html',
  styleUrl: './lista-unidades.component.css'
})
export class ListaUnidadesComponent implements OnInit {
  unidades: UnidadeOperacional[] = [];
  unidadesFiltradas: UnidadeOperacional[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroNome: string = '';
  filtroTipo: string = '';
  filtroStatus: string = '';
  filtroEstado: string = '';

  tiposUnidade = [
    { value: '', label: 'Todos os tipos' },
    { value: 'FILIAL', label: 'Filial' },
    { value: 'SETOR', label: 'Setor' },
    { value: 'OBRA', label: 'Obra' }
  ];

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'ATIVA', label: 'Ativa' },
    { value: 'INATIVA', label: 'Inativa' }
  ];

  constructor(
    private unidadeService: UnidadeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUnidades();
  }

  async carregarUnidades() {
    this.loading = true;
    this.error = '';

    try {
      this.unidades = await this.unidadeService.getUnidades().toPromise() || [];
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'Erro ao carregar unidades';
      console.error('Erro ao carregar unidades:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros() {
    this.unidadesFiltradas = this.unidades.filter(unidade => {
      const matchNome = !this.filtroNome || 
        unidade.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      
      const matchTipo = !this.filtroTipo || unidade.tipo === this.filtroTipo;
      
      const matchStatus = !this.filtroStatus || unidade.status === this.filtroStatus;
      
      const matchEstado = !this.filtroEstado || unidade.estado === this.filtroEstado;

      return matchNome && matchTipo && matchStatus && matchEstado;
    });
  }

  limparFiltros() {
    this.filtroNome = '';
    this.filtroTipo = '';
    this.filtroStatus = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  novaUnidade() {
    this.router.navigate(['/admin/unidades/nova']);
  }

  editarUnidade(id: number) {
    this.router.navigate(['/admin/unidades/editar', id]);
  }

  async excluirUnidade(unidade: UnidadeOperacional) {
    if (confirm(`Tem certeza que deseja excluir a unidade "${unidade.nome}"?`)) {
      try {
        await this.unidadeService.deleteUnidade(unidade.id).toPromise();
        await this.carregarUnidades();
      } catch (error) {
        alert('Erro ao excluir unidade');
        console.error('Erro ao excluir unidade:', error);
      }
    }
  }

  async alterarStatus(unidade: UnidadeOperacional) {
    const novoStatus = unidade.status === 'ATIVA' ? 'INATIVA' : 'ATIVA';
    
    try {
      await this.unidadeService.updateUnidade(unidade.id, { status: novoStatus }).toPromise();
      await this.carregarUnidades();
    } catch (error) {
      alert('Erro ao alterar status da unidade');
      console.error('Erro ao alterar status:', error);
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    return status === 'ATIVA' ? 'status-ativo' : 'status-inativo';
  }

  obterClasseTipo(tipo: string): string {
    switch (tipo) {
      case 'FILIAL': return 'tipo-filial';
      case 'SETOR': return 'tipo-setor';
      case 'OBRA': return 'tipo-obra';
      default: return '';
    }
  }
}