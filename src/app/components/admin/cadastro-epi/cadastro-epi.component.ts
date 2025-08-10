import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EPIService } from '../../../services/epi.service';
import { EPI, CreateEPIRequest } from '../../../models/epi.model';

@Component({
  selector: 'app-cadastro-epi',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-epi.component.html',
  styleUrl: './cadastro-epi.component.css'
})
export class CadastroEpiComponent implements OnInit {
  epiForm: FormGroup;
  isEditMode: boolean = false;
  epiId?: number;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  categorias = [
    'Proteção da Cabeça',
    'Proteção dos Olhos e Face',
    'Proteção Auditiva',
    'Proteção Respiratória',
    'Proteção das Mãos e Braços',
    'Proteção dos Pés e Pernas',
    'Proteção do Corpo',
    'Proteção contra Quedas'
  ];

  atividadesDisponiveis = [
    'Soldagem',
    'Corte',
    'Pintura',
    'Limpeza',
    'Manutenção Elétrica',
    'Trabalho em Altura',
    'Movimentação de Cargas',
    'Inspeção de Equipamentos',
    'Operação de Máquinas',
    'Trabalho em Espaços Confinados'
  ];

  perigosDisponiveis = [
    'Físicos - Ruído',
    'Físicos - Vibração',
    'Físicos - Calor',
    'Físicos - Frio',
    'Físicos - Radiação',
    'Químicos - Gases',
    'Químicos - Vapores',
    'Químicos - Poeiras',
    'Químicos - Fumos',
    'Biológicos - Vírus',
    'Biológicos - Bactérias',
    'Biológicos - Fungos',
    'Ergonômicos - Postura',
    'Ergonômicos - Repetitividade',
    'Acidente - Quedas',
    'Acidente - Cortes',
    'Acidente - Choques',
    'Acidente - Queimaduras'
  ];

  constructor(
    private fb: FormBuilder,
    private epiService: EPIService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.epiForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.epiId = +params['id'];
        this.loadEPI();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      categoria: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      atividades: [[], Validators.required],
      categoriasPerigo: [[], Validators.required],
      certificacao: ['', [Validators.required, Validators.maxLength(50)]],
      validadeCertificacao: ['', Validators.required],
      fornecedor: ['', [Validators.required, Validators.maxLength(100)]],
      observacoes: ['', Validators.maxLength(500)]
    });
  }

  async loadEPI() {
    if (!this.epiId) return;

    this.loading = true;
    try {
      const epi = await this.epiService.getEPIById(this.epiId).toPromise();
      if (epi) {
        this.epiForm.patchValue({
          nome: epi.nome,
          categoria: epi.categoria,
          descricao: epi.descricao,
          atividades: epi.atividades,
          categoriasPerigo: epi.categoriasPerigo,
          certificacao: epi.certificacao,
          validadeCertificacao: epi.validadeCertificacao ? new Date(epi.validadeCertificacao).toISOString().split('T')[0] : '',
          fornecedor: epi.fornecedor,
          observacoes: epi.observacoes
        });
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados do EPI';
      console.error('Erro ao carregar EPI:', error);
    } finally {
      this.loading = false;
    }
  }

  onAtividadeChange(atividade: string, event: any) {
    const atividades = this.epiForm.get('atividades')?.value || [];
    if (event.target.checked) {
      if (!atividades.includes(atividade)) {
        atividades.push(atividade);
      }
    } else {
      const index = atividades.indexOf(atividade);
      if (index > -1) {
        atividades.splice(index, 1);
      }
    }
    this.epiForm.patchValue({ atividades });
  }

  onPerigoChange(perigo: string, event: any) {
    const perigos = this.epiForm.get('categoriasPerigo')?.value || [];
    if (event.target.checked) {
      if (!perigos.includes(perigo)) {
        perigos.push(perigo);
      }
    } else {
      const index = perigos.indexOf(perigo);
      if (index > -1) {
        perigos.splice(index, 1);
      }
    }
    this.epiForm.patchValue({ categoriasPerigo: perigos });
  }

  isAtividadeSelecionada(atividade: string): boolean {
    const atividades = this.epiForm.get('atividades')?.value || [];
    return atividades.includes(atividade);
  }

  isPerigoSelecionado(perigo: string): boolean {
    const perigos = this.epiForm.get('categoriasPerigo')?.value || [];
    return perigos.includes(perigo);
  }

  async onSubmit() {
    if (this.epiForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.epiForm.value;
      
      const epiData: CreateEPIRequest = {
        nome: formData.nome,
        categoria: formData.categoria,
        descricao: formData.descricao,
        atividades: formData.atividades,
        categoriasPerigo: formData.categoriasPerigo,
        certificacao: formData.certificacao,
        validadeCertificacao: new Date(formData.validadeCertificacao),
        fornecedor: formData.fornecedor,
        observacoes: formData.observacoes
      };
      
      if (this.isEditMode && this.epiId) {
        await this.epiService.updateEPI(this.epiId, epiData).toPromise();
        this.success = 'EPI atualizado com sucesso!';
      } else {
        await this.epiService.createEPI(epiData).toPromise();
        this.success = 'EPI criado com sucesso!';
      }

      setTimeout(() => {
        this.router.navigate(['/admin/epis']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = this.isEditMode ? 'Erro ao atualizar EPI' : 'Erro ao criar EPI';
      }
      console.error('Erro ao salvar EPI:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched() {
    Object.keys(this.epiForm.controls).forEach(key => {
      const control = this.epiForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.epiForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.epiForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  cancelar() {
    this.router.navigate(['/admin/epis']);
  }
}