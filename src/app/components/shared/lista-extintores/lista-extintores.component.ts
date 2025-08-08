import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExtintorService } from '../../../services/extintor.service';
import { Extintor } from '../../../models/extintor.model';

@Component({
  selector: 'app-lista-extintores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-extintores.component.html',
  styleUrl: './lista-extintores.component.css'
})
export class ListaExtintoresComponent implements OnInit {
  extintores: Extintor[] = [];
  extintoresFiltrados: Extintor[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroCodigo: string = '';
  filtroTipo: string = '';
  filtroStatus: string = '';
  filtroUnidade: string = '';

  tiposExtintor = [
    { value: '', label: 'Todos os tipos' },
    { value: 'CO2', label: 'CO2' },
    { value: 'PO_QUIMICO', label: 'Pó Químico' },
    { value: 'AGUA', label: 'Água' },
    { value: 'ESPUMA', label: 'Espuma' },
    { value: 'HALON', label: 'Halon' }
  ];

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'MANUTENCAO', label: 'Em Manutenção' },
    { value: 'DESCARTADO', label: 'Descartado' }
  ];

  constructor(
    private extintorService: ExtintorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarExtintores();
  }

  async carregarExtintores() {
    this.loading = true;
    this.error = '';

    try {
      this.extintores = await this.extintorService.getExtintores().toPromise() || [];
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'Erro ao carregar extintores';
      console.error('Erro ao carregar extintores:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros() {
    this.extintoresFiltrados = this.extintores.filter(extintor => {
      const matchCodigo = !this.filtroCodigo || 
        extintor.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase());
      
      const matchTipo = !this.filtroTipo || extintor.tipo === this.filtroTipo;
      
      const matchStatus = !this.filtroStatus || extintor.status === this.filtroStatus;

      return matchCodigo && matchTipo && matchStatus;
    });
  }

  limparFiltros() {
    this.filtroCodigo = '';
    this.filtroTipo = '';
    this.filtroStatus = '';
    this.filtroUnidade = '';
    this.aplicarFiltros();
  }

  novoExtintor() {
    this.router.navigate(['/extintores/novo']);
  }

  editarExtintor(id: number) {
    this.router.navigate(['/extintores/editar', id]);
  }

  verHistorico(extintor: Extintor) {
    this.router.navigate(['/inspecoes/historico'], { 
      queryParams: { extintorId: extintor.id } 
    });
  }

  realizarInspecao(extintor: Extintor) {
    this.router.navigate(['/inspecoes/checklist', extintor.id]);
  }

  async gerarQRCode(extintor: Extintor) {
    try {
      await this.extintorService.generateQRCode(extintor.id).toPromise();
      alert('QR Code gerado com sucesso!');
    } catch (error) {
      alert('Erro ao gerar QR Code');
      console.error('Erro ao gerar QR Code:', error);
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    switch (status) {
      case 'ATIVO': return 'status-ativo';
      case 'MANUTENCAO': return 'status-manutencao';
      case 'DESCARTADO': return 'status-descartado';
      default: return '';
    }
  }

  obterClasseTipo(tipo: string): string {
    switch (tipo) {
      case 'CO2': return 'tipo-co2';
      case 'PO_QUIMICO': return 'tipo-po';
      case 'AGUA': return 'tipo-agua';
      case 'ESPUMA': return 'tipo-espuma';
      case 'HALON': return 'tipo-halon';
      default: return '';
    }
  }

  verificarVencimento(dataVencimento: Date): string {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'vencido';
    if (diffDays <= 30) return 'vencendo';
    return 'ok';
  }
}