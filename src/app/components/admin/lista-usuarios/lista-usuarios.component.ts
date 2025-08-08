import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuariosFiltrados: User[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtros
  filtroNome: string = '';
  filtroTipo: string = '';
  filtroStatus: string = '';

  tiposUsuario = [
    { value: '', label: 'Todos os tipos' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'TECNICO', label: 'Técnico' }
  ];

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
    { value: 'BLOQUEADO', label: 'Bloqueado' }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  async carregarUsuarios() {
    this.loading = true;
    this.error = '';

    try {
      this.usuarios = await this.userService.getUsers().toPromise() || [];
      this.aplicarFiltros();
    } catch (error) {
      this.error = 'Erro ao carregar usuários';
      console.error('Erro ao carregar usuários:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const matchNome = !this.filtroNome || 
        usuario.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      
      const matchTipo = !this.filtroTipo || usuario.tipoUsuario === this.filtroTipo;
      
      const matchStatus = !this.filtroStatus || usuario.status === this.filtroStatus;

      return matchNome && matchTipo && matchStatus;
    });
  }

  limparFiltros() {
    this.filtroNome = '';
    this.filtroTipo = '';
    this.filtroStatus = '';
    this.aplicarFiltros();
  }

  novoUsuario() {
    this.router.navigate(['/admin/usuarios/novo']);
  }

  editarUsuario(id: number) {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  async alterarStatus(usuario: User) {
    const novoStatus = usuario.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    
    try {
      await this.userService.updateUserStatus(usuario.id, novoStatus).toPromise();
      await this.carregarUsuarios();
    } catch (error) {
      alert('Erro ao alterar status do usuário');
      console.error('Erro ao alterar status:', error);
    }
  }

  async resetarSenha(usuario: User) {
    if (confirm(`Resetar senha do usuário "${usuario.nome}"?`)) {
      try {
        await this.userService.resetUserPassword(usuario.id).toPromise();
        alert('Senha resetada com sucesso! Email enviado ao usuário.');
      } catch (error) {
        alert('Erro ao resetar senha');
        console.error('Erro ao resetar senha:', error);
      }
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterClasseStatus(status: string): string {
    switch (status) {
      case 'ATIVO': return 'status-ativo';
      case 'INATIVO': return 'status-inativo';
      case 'BLOQUEADO': return 'status-bloqueado';
      default: return '';
    }
  }

  obterClasseTipo(tipo: string): string {
    return tipo === 'ADMIN' ? 'tipo-admin' : 'tipo-tecnico';
  }
}