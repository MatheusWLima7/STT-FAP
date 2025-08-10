import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UnidadeService } from '../../../services/unidade.service';
import { ResponsavelUnidade, UnidadeOperacional } from '../../../models/unidade.model';

@Component({
  selector: 'app-cadastro-responsavel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-responsavel.component.html',
  styleUrl: './cadastro-responsavel.component.css'
})
export class CadastroResponsavelComponent implements OnInit {
  responsavelForm: FormGroup;
  isEditMode: boolean = false;
  responsavelId?: number;
  unidadeId?: number;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  unidadesDisponiveis: UnidadeOperacional[] = [];

  constructor(
    private fb: FormBuilder,
    private unidadeService: UnidadeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.responsavelForm = this.createForm();
  }

  ngOnInit() {
    this.loadUnidades();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.responsavelId = +params['id'];
        this.loadResponsavel();
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['unidadeId']) {
        this.unidadeId = +params['unidadeId'];
        this.responsavelForm.patchValue({ unidadeId: this.unidadeId });
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      cargo: ['', [Validators.required, Validators.maxLength(50)]],
      unidadeId: ['', Validators.required],
      status: ['ATIVO']
    });
  }

  async loadUnidades() {
    try {
      this.unidadesDisponiveis = await this.unidadeService.getUnidades().toPromise() || [];
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    }
  }

  async loadResponsavel() {
    if (!this.responsavelId || !this.unidadeId) return;

    this.loading = true;
    try {
      const responsaveis = await this.unidadeService.getResponsaveis(this.unidadeId).toPromise();
      const responsavel = responsaveis?.find(r => r.id === this.responsavelId);
      
      if (responsavel) {
        this.responsavelForm.patchValue({
          nome: responsavel.nome,
          email: responsavel.email,
          telefone: responsavel.telefone,
          cargo: responsavel.cargo,
          unidadeId: responsavel.unidadeId,
          status: responsavel.status
        });
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados do responsável';
      console.error('Erro ao carregar responsável:', error);
    } finally {
      this.loading = false;
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
      this.responsavelForm.patchValue({ telefone: value });
    }
  }

  async onSubmit() {
    if (this.responsavelForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.responsavelForm.value;
      const unidadeId = parseInt(formData.unidadeId);
      
      if (this.isEditMode && this.responsavelId) {
        await this.unidadeService.updateResponsavel(unidadeId, this.responsavelId, formData).toPromise();
        this.success = 'Responsável atualizado com sucesso!';
      } else {
        await this.unidadeService.createResponsavel(unidadeId, formData).toPromise();
        this.success = 'Responsável criado com sucesso!';
      }

      setTimeout(() => {
        this.router.navigate(['/admin/responsaveis']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = this.isEditMode ? 'Erro ao atualizar responsável' : 'Erro ao criar responsável';
      }
      console.error('Erro ao salvar responsável:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched() {
    Object.keys(this.responsavelForm.controls).forEach(key => {
      const control = this.responsavelForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.responsavelForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.responsavelForm.get(fieldName);
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
    this.router.navigate(['/admin/responsaveis']);
  }
}