import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtintorService } from '../../../services/extintor.service';
import { UnidadeService } from '../../../services/unidade.service';
import { Extintor } from '../../../models/extintor.model';
import { UnidadeOperacional } from '../../../models/unidade.model';

@Component({
  selector: 'app-cadastro-extintor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-extintor.component.html',
  styleUrl: './cadastro-extintor.component.css'
})
export class CadastroExtintorComponent implements OnInit {
  extintorForm: FormGroup;
  isEditMode: boolean = false;
  extintorId?: number;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  unidadesDisponiveis: UnidadeOperacional[] = [];

  tiposExtintor = [
    { value: 'CO2', label: 'CO2 (Dióxido de Carbono)' },
    { value: 'PO_QUIMICO', label: 'Pó Químico Seco' },
    { value: 'AGUA', label: 'Água' },
    { value: 'ESPUMA', label: 'Espuma' },
    { value: 'HALON', label: 'Halon' }
  ];

  statusOptions = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'MANUTENCAO', label: 'Em Manutenção' },
    { value: 'DESCARTADO', label: 'Descartado' }
  ];

  constructor(
    private fb: FormBuilder,
    private extintorService: ExtintorService,
    private unidadeService: UnidadeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.extintorForm = this.createForm();
  }

  ngOnInit() {
    this.loadUnidades();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.extintorId = +params['id'];
        this.loadExtintor();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      tipo: ['CO2', Validators.required],
      capacidade: ['', [Validators.required, Validators.min(0.1), Validators.max(100)]],
      fabricante: ['', [Validators.required, Validators.maxLength(50)]],
      dataFabricacao: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      localizacao: ['', [Validators.required, Validators.maxLength(100)]],
      unidadeId: ['', Validators.required],
      status: ['ATIVO', Validators.required],
      proximaInspecao: [''],
      observacoes: ['', Validators.maxLength(500)]
    });
  }

  async loadUnidades() {
    try {
      this.unidadesDisponiveis = await this.unidadeService.getUnidades().toPromise() || [];
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    }
  }

  async loadExtintor() {
    if (!this.extintorId) return;

    this.loading = true;
    try {
      const extintor = await this.extintorService.getExtintorById(this.extintorId).toPromise();
      if (extintor) {
        this.extintorForm.patchValue({
          codigo: extintor.codigo,
          tipo: extintor.tipo,
          capacidade: extintor.capacidade,
          fabricante: extintor.fabricante,
          dataFabricacao: extintor.dataFabricacao ? new Date(extintor.dataFabricacao).toISOString().split('T')[0] : '',
          dataVencimento: extintor.dataVencimento ? new Date(extintor.dataVencimento).toISOString().split('T')[0] : '',
          localizacao: extintor.localizacao,
          unidadeId: extintor.unidadeId,
          status: extintor.status,
          proximaInspecao: extintor.proximaInspecao ? new Date(extintor.proximaInspecao).toISOString().split('T')[0] : '',
          observacoes: extintor.observacoes
        });
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados do extintor';
      console.error('Erro ao carregar extintor:', error);
    } finally {
      this.loading = false;
    }
  }

  validarDatas(): boolean {
    const dataFabricacao = new Date(this.extintorForm.get('dataFabricacao')?.value);
    const dataVencimento = new Date(this.extintorForm.get('dataVencimento')?.value);
    
    if (dataFabricacao >= dataVencimento) {
      this.error = 'Data de vencimento deve ser posterior à data de fabricação';
      return false;
    }
    
    return true;
  }

  calcularProximaInspecao() {
    const dataVencimento = this.extintorForm.get('dataVencimento')?.value;
    if (dataVencimento) {
      const vencimento = new Date(dataVencimento);
      const proximaInspecao = new Date(vencimento);
      proximaInspecao.setFullYear(proximaInspecao.getFullYear() - 1); // 1 ano antes do vencimento
      
      this.extintorForm.patchValue({
        proximaInspecao: proximaInspecao.toISOString().split('T')[0]
      });
    }
  }

  async onSubmit() {
    if (this.extintorForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.validarDatas()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.extintorForm.value;
      
      const extintorData = {
        codigo: formData.codigo,
        tipo: formData.tipo,
        capacidade: parseFloat(formData.capacidade),
        fabricante: formData.fabricante,
        dataFabricacao: new Date(formData.dataFabricacao),
        dataVencimento: new Date(formData.dataVencimento),
        localizacao: formData.localizacao,
        unidadeId: parseInt(formData.unidadeId),
        status: formData.status,
        proximaInspecao: formData.proximaInspecao ? new Date(formData.proximaInspecao) : undefined,
        observacoes: formData.observacoes
      };
      
      if (this.isEditMode && this.extintorId) {
        await this.extintorService.updateExtintor(this.extintorId, extintorData).toPromise();
        this.success = 'Extintor atualizado com sucesso!';
      } else {
        await this.extintorService.createExtintor(extintorData).toPromise();
        this.success = 'Extintor criado com sucesso!';
      }

      setTimeout(() => {
        this.router.navigate(['/extintores']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = this.isEditMode ? 'Erro ao atualizar extintor' : 'Erro ao criar extintor';
      }
      console.error('Erro ao salvar extintor:', error);
    } finally {
      this.loading = false;
    }
  }

  async gerarQRCode() {
    if (!this.extintorId) return;

    try {
      const qrCode = await this.extintorService.generateQRCode(this.extintorId).toPromise();
      this.success = 'QR Code gerado com sucesso!';
      // Aqui você pode implementar a exibição do QR Code
    } catch (error) {
      this.error = 'Erro ao gerar QR Code';
      console.error('Erro ao gerar QR Code:', error);
    }
  }

  markFormGroupTouched() {
    Object.keys(this.extintorForm.controls).forEach(key => {
      const control = this.extintorForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.extintorForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.extintorForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    }
    return '';
  }

  cancelar() {
    this.router.navigate(['/extintores']);
  }
}