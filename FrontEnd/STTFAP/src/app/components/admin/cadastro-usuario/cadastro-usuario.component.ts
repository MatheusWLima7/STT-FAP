import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, CreateUserRequest } from '../../../models/user.model';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId?: number;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  // Opções para selects
  tiposUsuario = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'TECNICO', label: 'Técnico' }
  ];

  unidadesDisponiveis: any[] = [];
  fotoSelecionada?: File;
  previewFoto?: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser();
      }
    });
    
    this.loadUnidades();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      tipoUsuario: ['TECNICO', Validators.required],
      cargo: ['', Validators.maxLength(50)],
      dataAdmissao: [''],
      unidadesVinculadas: [[], Validators.required],
      observacoes: ['', Validators.maxLength(500)],
      status: ['ATIVO']
    });
  }

  async loadUser() {
    if (!this.userId) return;

    this.loading = true;
    try {
      const user = await this.userService.getUserById(this.userId).toPromise();
      if (user) {
        this.userForm.patchValue({
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
          telefone: user.telefone,
          tipoUsuario: user.tipoUsuario,
          cargo: user.cargo,
          dataAdmissao: user.dataAdmissao ? new Date(user.dataAdmissao).toISOString().split('T')[0] : '',
          unidadesVinculadas: user.unidadesVinculadas,
          observacoes: user.observacoes,
          status: user.status
        });

        if (user.foto) {
          this.previewFoto = user.foto;
        }
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados do usuário';
      console.error('Erro ao carregar usuário:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadUnidades() {
    try {
      // Simular carregamento de unidades - substituir pela chamada real da API
      this.unidadesDisponiveis = [
        { id: 1, nome: 'Matriz - São Paulo' },
        { id: 2, nome: 'Filial - Rio de Janeiro' },
        { id: 3, nome: 'Obra - Construção ABC' },
        { id: 4, nome: 'Setor - Produção' }
      ];
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo e tamanho do arquivo
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

  formatarCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      this.userForm.patchValue({ cpf: value.replace(/\D/g, '') });
      event.target.value = value;
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
      this.userForm.patchValue({ telefone: value });
      event.target.value = value;
    }
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;

    if (parseInt(cpf.charAt(9)) !== digito1) {
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;

    return parseInt(cpf.charAt(10)) === digito2;
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    // Validar CPF
    const cpf = this.userForm.get('cpf')?.value;
    if (!this.validarCPF(cpf)) {
      this.error = 'CPF inválido';
      return;
    }

    // Validar unidades para técnicos
    const tipoUsuario = this.userForm.get('tipoUsuario')?.value;
    const unidades = this.userForm.get('unidadesVinculadas')?.value;
    if (tipoUsuario === 'TECNICO' && (!unidades || unidades.length === 0)) {
      this.error = 'Técnicos devem estar vinculados a pelo menos uma unidade';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.userForm.value;
      
      if (this.isEditMode && this.userId) {
        // Atualizar usuário existente
        await this.userService.updateUser(this.userId, formData).toPromise();
        
        // Upload da foto se selecionada
        if (this.fotoSelecionada) {
          await this.userService.uploadUserPhoto(this.userId, this.fotoSelecionada).toPromise();
        }
        
        this.success = 'Usuário atualizado com sucesso!';
      } else {
        // Criar novo usuário
        const createRequest: CreateUserRequest = {
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf,
          telefone: formData.telefone,
          tipoUsuario: formData.tipoUsuario,
          cargo: formData.cargo,
          dataAdmissao: formData.dataAdmissao ? new Date(formData.dataAdmissao) : undefined,
          unidadesVinculadas: formData.unidadesVinculadas,
          observacoes: formData.observacoes
        };

        const newUser = await this.userService.createUser(createRequest).toPromise();
        
        // Upload da foto se selecionada
        if (this.fotoSelecionada && newUser) {
          await this.userService.uploadUserPhoto(newUser.id, this.fotoSelecionada).toPromise();
        }
        
        this.success = 'Usuário criado com sucesso! Um email com as credenciais foi enviado.';
      }

      // Redirecionar após 2 segundos
      setTimeout(() => {
        this.router.navigate(['/admin/usuarios']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = this.isEditMode ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário';
      }
      console.error('Erro ao salvar usuário:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }

  resetarSenha() {
    if (!this.userId) return;

    if (confirm('Tem certeza que deseja resetar a senha deste usuário?')) {
      this.userService.resetUserPassword(this.userId).subscribe({
        next: () => {
          this.success = 'Senha resetada com sucesso! Um email foi enviado ao usuário.';
        },
        error: (error) => {
          this.error = 'Erro ao resetar senha';
          console.error('Erro ao resetar senha:', error);
        }
      });
    }
  }
}