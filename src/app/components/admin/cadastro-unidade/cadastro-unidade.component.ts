import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UnidadeService } from '../../../services/unidade.service';
import { UnidadeOperacional, CreateUnidadeRequest } from '../../../models/unidade.model';

@Component({
  selector: 'app-cadastro-unidade',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-unidade.component.html',
  styleUrl: './cadastro-unidade.component.css'
})
export class CadastroUnidadeComponent implements OnInit {
  unidadeForm: FormGroup;
  isEditMode: boolean = false;
  unidadeId?: number;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  tiposUnidade = [
    { value: 'FILIAL', label: 'Filial' },
    { value: 'SETOR', label: 'Setor' },
    { value: 'OBRA', label: 'Obra' }
  ];

  estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(
    private fb: FormBuilder,
    private unidadeService: UnidadeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.unidadeForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.unidadeId = +params['id'];
        this.loadUnidade();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipo: ['FILIAL', Validators.required],
      endereco: ['', [Validators.required, Validators.maxLength(200)]],
      cidade: ['', [Validators.required, Validators.maxLength(50)]],
      estado: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      observacoes: ['', Validators.maxLength(500)]
    });
  }

  async loadUnidade() {
    if (!this.unidadeId) return;

    this.loading = true;
    try {
      const unidade = await this.unidadeService.getUnidadeById(this.unidadeId).toPromise();
      if (unidade) {
        this.unidadeForm.patchValue({
          nome: unidade.nome,
          tipo: unidade.tipo,
          endereco: unidade.endereco,
          cidade: unidade.cidade,
          estado: unidade.estado,
          cep: unidade.cep,
          telefone: unidade.telefone,
          email: unidade.email,
          observacoes: unidade.observacoes
        });
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados da unidade';
      console.error('Erro ao carregar unidade:', error);
    } finally {
      this.loading = false;
    }
  }

  formatarCEP(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      event.target.value = value;
      this.unidadeForm.patchValue({ cep: value });
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
      this.unidadeForm.patchValue({ telefone: value });
    }
  }

  async onSubmit() {
    if (this.unidadeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.unidadeForm.value;
      
      if (this.isEditMode && this.unidadeId) {
        await this.unidadeService.updateUnidade(this.unidadeId, formData).toPromise();
        this.success = 'Unidade atualizada com sucesso!';
      } else {
        const createRequest: CreateUnidadeRequest = {
          nome: formData.nome,
          tipo: formData.tipo,
          endereco: formData.endereco,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          telefone: formData.telefone,
          email: formData.email,
          observacoes: formData.observacoes
        };

        await this.unidadeService.createUnidade(createRequest).toPromise();
        this.success = 'Unidade criada com sucesso!';
      }

      setTimeout(() => {
        this.router.navigate(['/admin/unidades']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = this.isEditMode ? 'Erro ao atualizar unidade' : 'Erro ao criar unidade';
      }
      console.error('Erro ao salvar unidade:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched() {
    Object.keys(this.unidadeForm.controls).forEach(key => {
      const control = this.unidadeForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.unidadeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.unidadeForm.get(fieldName);
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
    this.router.navigate(['/admin/unidades']);
  }
}