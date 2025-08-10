import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificacaoService } from '../../../services/notificacao.service';
import { Notificacao } from '../../../models/notificacao.model';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css'
})
export class NotificacoesComponent implements OnInit {
  notificacoes: Notificacao[] = [];
  notificacoesFiltradas: Notificacao[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroTipo: string = '';
  filtroCategoria: string = '';
  filtroStatus: string = '';

  tipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'INFO', label: 'Informação' },
    { value: 'ALERTA', label: 'Alerta' },
    { value: 'CRITICO', label: 'Crítico' },
    { value: 'SUCESSO', label: 'Sucesso' }
  ];

  categoriaOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'VENCIMENTO', label: 'Vencimento' },
    { value: 'INSPECAO', label: 'Inspeção' },
    { value: 'SERVICO', label: 'Serviço' },
    { value: 'SISTEMA', label: 'Sistema' },
    { value: 'MANUTENCAO', label: 'Manutenção' }
  ];

  statusOptions = [
    { value: '', label: 'Todas' },
    { value: 'nao-lida', label: 'Não Lidas' },
    { value: 'lida', label: 'Lidas' }
  ];

  constructor(
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarNotificacoes();
  }

  async carregarNotificacoes() {
    this.loading = true;
    this.error = '';

    try {
      this.notificacoes = await this.notificacaoService.getNotificacoes().toPromise() || [];
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'Erro ao carregar notificações';
      console.error('Erro ao carregar notificações:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros() {
    this.notificacoesFiltradas = this.notificacoes.filter(notificacao => {
      const matchTipo = !this.filtroTipo || notificacao.tipo === this.filtroTipo;
      
      const matchCategoria = !this.filtroCategoria || notificacao.categoria === this.filtroCategoria;
      
      const matchStatus = !this.filtroStatus || 
        (this.filtroStatus === 'lida' && notificacao.lida) ||
        (this.filtroStatus === 'nao-lida' && !notificacao.lida);

      return matchTipo && matchCategoria && matchStatus;
    });

    // Ordenar por data (mais recentes primeiro) e status (não lidas primeiro)
    this.notificacoesFiltradas.sort((a, b) => {
      if (a.lida !== b.lida) {
        return a.lida ? 1 : -1;
      }
      return new Date(b.dataEnvio).getTime() - new Date(a.dataEnvio).getTime();
    });
  }

  limparFiltros() {
    this.filtroTipo = '';
    this.filtroCategoria = '';
    this.filtroStatus = '';
    this.aplicarFiltros();
  }

  marcarComoLida(notificacao: Notificacao) {
    if (!notificacao.lida) {
      this.notificacaoService.marcarComoLida(notificacao.id).subscribe({
        next: () => {
          notificacao.lida = true;
          notificacao.dataLeitura = new Date();
          
          // Se tem link, navegar
          if (notificacao.link) {
            this.router.navigate([notificacao.link]);
          }
        },
        error: (error) => {
          console.error('Erro ao marcar como lida:', error);
        }
      });
    } else if (notificacao.link) {
      this.router.navigate([notificacao.link]);
    }
  }

  marcarTodasComoLidas() {
    if (confirm('Marcar todas as notificações como lidas?')) {
      this.notificacaoService.marcarTodasComoLidas().subscribe({
        next: () => {
          this.notificacoes.forEach(n => {
            n.lida = true;
            n.dataLeitura = new Date();
          });
          this.aplicarFiltros();
        },
        error: (error) => {
          alert('Erro ao marcar notificações como lidas');
          console.error('Erro ao marcar todas como lidas:', error);
        }
      });
    }
  }

  excluirNotificacao(notificacao: Notificacao) {
    if (confirm('Excluir esta notificação?')) {
      this.notificacaoService.deleteNotificacao(notificacao.id).subscribe({
        next: () => {
          const index = this.notificacoes.indexOf(notificacao);
          if (index > -1) {
            this.notificacoes.splice(index, 1);
          }
          this.aplicarFiltros();
        },
        error: (error) => {
          alert('Erro ao excluir notificação');
          console.error('Erro ao excluir notificação:', error);
        }
      });
    }
  }

  formatarData(data: Date): string {
    const agora = new Date();
    const notificacao = new Date(data);
    const diffMs = agora.getTime() - notificacao.getTime();
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutos < 1) {
      return 'Agora mesmo';
    } else if (diffMinutos < 60) {
      return `${diffMinutos} min atrás`;
    } else if (diffHoras < 24) {
      return `${diffHoras}h atrás`;
    } else if (diffDias < 7) {
      return `${diffDias} dia(s) atrás`;
    } else {
      return notificacao.toLocaleDateString('pt-BR');
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

  obterClasseTipo(tipo: string): string {
    switch (tipo) {
      case 'CRITICO': return 'tipo-critico';
      case 'ALERTA': return 'tipo-alerta';
      case 'INFO': return 'tipo-info';
      case 'SUCESSO': return 'tipo-sucesso';
      default: return '';
    }
  }

  obterIconeCategoria(categoria: string): string {
    switch (categoria) {
      case 'VENCIMENTO': return '⏰';
      case 'INSPECAO': return '🔍';
      case 'SERVICO': return '⚙️';
      case 'SISTEMA': return '💻';
      case 'MANUTENCAO': return '🔧';
      default: return '📋';
    }
  }

  contarNaoLidas(): number {
    return this.notificacoes.filter(n => !n.lida).length;
  }
}