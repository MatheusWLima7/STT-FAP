import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {
  perfilForm: FormGroup;
  senhaForm: FormGroup;
  currentUser?: User;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  abaSelecionada: string = 'dados';
  fotoSelecionada?: File;
  previewFoto?: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.perfilForm = this.createPerfilForm();
    this.senhaForm = this.createSenhaForm();
    this.currentUser = this.authService.currentUserValue || undefined;
  }

  ngOnInit() {
    if (this.currentUser) {
      this.loadUserData();
    }
  }

  createPerfilForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      cargo: ['', Validators.maxLength(50)]
    });
  }

  createSenhaForm(): FormGroup {
    return this.fb.group({
      senhaAtual: ['', [Validators.required, Validators.minLength(6)]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.senhasIguaisValidator });
  }

  senhasIguaisValidator(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return novaSenha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  loadUserData() {
    if (!this.currentUser) return;

    this.perfilForm.patchValue({
      nome: this.currentUser.nome,
      email: this.currentUser.email,
      telefone: this.currentUser.telefone,
      cargo: this.currentUser.cargo
    });

    if (this.currentUser.foto) {
      this.previewFoto = this.currentUser.foto;
    }
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
    this.error = '';
    this.success = '';
  }

  onFotoSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.error = 'Apenas arquivos de imagem são permitidos';
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        this.error = 'Arquivo deve ter no máximo 2MB';
        return;
      }

      this.fotoSelecionada = file;
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewFoto = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  formatarTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      event.target.value = value;
      this.perfilForm.patchValue({ telefone: value });
    }
  }

  async salvarPerfil() {
    if (this.perfilForm.invalid) {
      this.markFormGroupTouched(this.perfilForm);
      return;
    }

    if (!this.currentUser) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.perfilForm.value;
      
      await this.userService.updateUser(this.currentUser.id, formData).toPromise();

      // Upload da foto se selecionada
      if (this.fotoSelecionada) {
        await this.userService.uploadUserPhoto(this.currentUser.id, this.fotoSelecionada).toPromise();
      }

      // Atualizar dados do usuário logado
      const updatedUser = { ...this.currentUser, ...formData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      this.success = 'Perfil atualizado com sucesso!';
      
    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = 'Erro ao atualizar perfil';
      }
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      this.loading = false;
    }
  }

  async alterarSenha() {
    if (this.senhaForm.invalid) {
      this.markFormGroupTouched(this.senhaForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.senhaForm.value;
      
      await this.authService.changePassword(formData.senhaAtual, formData.novaSenha).toPromise();

      this.success = 'Senha alterada com sucesso!';
      this.senhaForm.reset();
      
    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = 'Erro ao alterar senha';
      }
      console.error('Erro ao alterar senha:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato inválido';
    }
    
    // Erro específico para confirmação de senha
    if (fieldName === 'confirmarSenha' && form.errors?.['senhasDiferentes']) {
      return 'Senhas não coincidem';
    }
    
    return '';
  }

  logout() {
    if (confirm('Deseja sair do sistema?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  voltar() {
    this.router.navigate(['/menu']);
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterIniciais(nome: string): string {
    return nome.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }
}