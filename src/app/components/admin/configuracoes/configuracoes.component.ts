import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent implements OnInit {
  configForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  abaSelecionada: string = 'geral';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.configForm = this.createForm();
  }

  ngOnInit() {
    this.carregarConfiguracoes();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Configurações Gerais
      nomeEmpresa: ['', [Validators.required, Validators.maxLength(100)]],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      endereco: ['', [Validators.required, Validators.maxLength(200)]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      
      // Configurações de Inspeção
      diasAntecedenciaInspecao: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      diasToleranciaAtraso: [7, [Validators.required, Validators.min(0), Validators.max(30)]],
      validadeInspecaoMeses: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
      
      // Configurações de Notificação
      emailNotificacoes: [true],
      smsNotificacoes: [false],
      notificarVencimento: [true],
      notificarInspecoesPendentes: [true],
      notificarServicosAtrasados: [true],
      
      // Configurações de Relatório
      logoEmpresa: [''],
      formatoPadraoRelatorio: ['PDF', Validators.required],
      incluirAssinaturasPadrao: [true],
      incluirFotosPadrao: [true],
      
      // Configurações de Backup
      backupAutomatico: [true],
      frequenciaBackup: ['DIARIO', Validators.required],
      manterBackupsDias: [30, [Validators.required, Validators.min(7), Validators.max(365)]]
    });
  }

  carregarConfiguracoes() {
    // Simular carregamento das configurações
    // Em um cenário real, isso viria de uma API
    this.configForm.patchValue({
      nomeEmpresa: 'Empresa Exemplo Ltda',
      cnpj: '12345678000199',
      endereco: 'Rua Exemplo, 123 - Centro',
      telefone: '(11) 99999-9999',
      email: 'contato@empresa.com',
      diasAntecedenciaInspecao: 30,
      diasToleranciaAtraso: 7,
      validadeInspecaoMeses: 12,
      emailNotificacoes: true,
      smsNotificacoes: false,
      notificarVencimento: true,
      notificarInspecoesPendentes: true,
      notificarServicosAtrasados: true,
      formatoPadraoRelatorio: 'PDF',
      incluirAssinaturasPadrao: true,
      incluirFotosPadrao: true,
      backupAutomatico: true,
      frequenciaBackup: 'DIARIO',
      manterBackupsDias: 30
    });
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
  }

  onLogoSelected(event: any) {
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

      // Aqui você faria o upload do arquivo
      // Por enquanto, apenas simular
      this.configForm.patchValue({ logoEmpresa: file.name });
    }
  }

  formatarCNPJ(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      this.configForm.patchValue({ cnpj: value.replace(/\D/g, '') });
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
      event.target.value = value;
      this.configForm.patchValue({ telefone: value });
    }
  }

  testarNotificacoes() {
    this.loading = true;
    
    // Simular teste de notificações
    setTimeout(() => {
      this.loading = false;
      this.success = 'Notificações de teste enviadas com sucesso!';
      setTimeout(() => this.success = '', 3000);
    }, 2000);
  }

  executarBackup() {
    this.loading = true;
    
    // Simular execução de backup
    setTimeout(() => {
      this.loading = false;
      this.success = 'Backup executado com sucesso!';
      setTimeout(() => this.success = '', 3000);
    }, 3000);
  }

  onSubmit() {
    if (this.configForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // Simular salvamento das configurações
    setTimeout(() => {
      this.loading = false;
      this.success = 'Configurações salvas com sucesso!';
      setTimeout(() => this.success = '', 3000);
    }, 1500);
  }

  markFormGroupTouched() {
    Object.keys(this.configForm.controls).forEach(key => {
      const control = this.configForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.configForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.configForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['pattern']) return 'Formato inválido';
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }
}