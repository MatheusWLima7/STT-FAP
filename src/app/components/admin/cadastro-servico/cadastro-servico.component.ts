import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicoService } from '../../../services/servico.service';
import { UserService } from '../../../services/user.service';
import { UnidadeService } from '../../../services/unidade.service';
import { EPIService } from '../../../services/epi.service';
import { Servico } from '../../../models/servico.model';
import { User } from '../../../models/user.model';
import { UnidadeOperacional } from '../../../models/unidade.model';
import { EPI } from '../../../models/epi.model';

@Component({
  selector: 'app-cadastro-servico',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-servico.component.html',
  styleUrl: './cadastro-servico.component.css'
})
export class CadastroServicoComponent implements OnInit {
  servicoForm: FormGroup;
  isEditMode: boolean = false;
  servicoId?: number;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  tecnicos: User[] = [];
  unidades: UnidadeOperacional[] = [];
  episDisponiveis: EPI[] = [];

  tiposServico = [
    { value: 'INSPECAO', label: 'Inspeção' },
    { value: 'MANUTENCAO', label: 'Manutenção' },
    { value: 'INSTALACAO', label: 'Instalação' },
    { value: 'TREINAMENTO', label: 'Treinamento' }
  ];

  prioridades = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'CRITICA', label: 'Crítica' }
  ];

  medidasControleDisponiveis = [
    'Isolamento da área',
    'Sinalização de segurança',
    'Ventilação adequada',
    'Iluminação apropriada',
    'Controle de acesso',
    'Supervisão constante',
    'Comunicação via rádio',
    'Kit de primeiros socorros',
    'Equipamento de emergência',
    'Procedimento de evacuação'
  ];

  constructor(
    private fb: FormBuilder,
    private servicoService: ServicoService,
    private userService: UserService,
    private unidadeService: UnidadeService,
    private epiService: EPIService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.servicoForm = this.createForm();
  }

  ngOnInit() {
    this.loadDependencies();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.servicoId = +params['id'];
        this.loadServico();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      unidadeId: ['', Validators.required],
      tecnicoId: [''],
      dataInicio: ['', Validators.required],
      dataFim: [''],
      tipoServico: ['INSPECAO', Validators.required],
      prioridade: ['MEDIA', Validators.required],
      episSelecionados: [[]],
      medidasControle: [[]],
      observacoes: ['', Validators.maxLength(500)]
    });
  }

  async loadDependencies() {
    try {
      const [usuarios, unidades, epis] = await Promise.all([
        this.userService.getUsers().toPromise(),
        this.unidadeService.getUnidades().toPromise(),
        this.epiService.getEPIs().toPromise()
      ]);

      this.tecnicos = (usuarios || []).filter(u => u.tipoUsuario === 'TECNICO' && u.status === 'ATIVO');
      this.unidades = unidades || [];
      this.episDisponiveis = epis || [];
    } catch (error) {
      console.error('Erro ao carregar dependências:', error);
    }
  }

  async loadServico() {
    if (!this.servicoId) return;

    this.loading = true;
    try {
      const servico = await this.servicoService.getServicoById(this.servicoId).toPromise();
      if (servico) {
        this.servicoForm.patchValue({
          titulo: servico.titulo,
          descricao: servico.descricao,
          unidadeId: servico.unidadeId,
          tecnicoId: servico.tecnicoId,
          dataInicio: servico.dataInicio ? new Date(servico.dataInicio).toISOString().split('T')[0] : '',
          dataFim: servico.dataFim ? new Date(servico.dataFim).toISOString().split('T')[0] : '',
          tipoServico: servico.tipoServico,
          prioridade: servico.prioridade,
          episSelecionados: servico.episSelecionados,
          medidasControle: servico.medidasControle,
          observacoes: servico.observacoes
        });
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados do serviço';
      console.error('Erro ao carregar serviço:', error);
    } finally {
      this.loading = false;
    }
  }

  onEPIChange(epiId: number, event: any) {
    const episSelecionados = this.servicoForm.get('episSelecionados')?.value || [];
    if (event.target.checked) {
      if (!episSelecionados.includes(epiId)) {
        episSelecionados.push(epiId);
      }
    } else {
      const index = episSelecionados.indexOf(epiId);
      if (index > -1) {
        episSelecionados.splice(index, 1);
      }
    }
    this.servicoForm.patchValue({ episSelecionados });
  }

  onMedidaControleChange(medida: string, event: any) {
    const medidasControle = this.servicoForm.get('medidasControle')?.value || [];
    if (event.target.checked) {
      if (!medidasControle.includes(medida)) {
        medidasControle.push(medida);
      }
    } else {
      const index = medidasControle.indexOf(medida);
      if (index > -1) {
        medidasControle.splice(index, 1);
      }
    }
    this.servicoForm.patchValue({ medidasControle });
  }

  isEPISelecionado(epiId: number): boolean {
    const episSelecionados = this.servicoForm.get('episSelecionados')?.value || [];
    return episSelecionados.includes(epiId);
  }

  isMedidaSelecionada(medida: string): boolean {
    const medidasControle = this.servicoForm.get('medidasControle')?.value || [];
    return medidasControle.includes(medida);
  }

  calcularDataFim() {
    const dataInicio = this.servicoForm.get('dataInicio')?.value;
    const tipoServico = this.servicoForm.get('tipoServico')?.value;
    
    if (dataInicio && tipoServico) {
      const inicio = new Date(dataInicio);
      let diasAdicionais = 1; // Padrão
      
      switch (tipoServico) {
        case 'INSPECAO':
          diasAdicionais = 1;
          break;
        case 'MANUTENCAO':
          diasAdicionais = 3;
          break;
        case 'INSTALACAO':
          diasAdicionais = 5;
          break;
        case 'TREINAMENTO':
          diasAdicionais = 2;
          break;
      }
      
      const dataFim = new Date(inicio);
      dataFim.setDate(dataFim.getDate() + diasAdicionais);
      
      this.servicoForm.patchValue({
        dataFim: dataFim.toISOString().split('T')[0]
      });
    }
  }

  async onSubmit() {
    if (this.servicoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    // Validar datas
    const dataInicio = new Date(this.servicoForm.get('dataInicio')?.value);
    const dataFim = this.servicoForm.get('dataFim')?.value ? new Date(this.servicoForm.get('dataFim')?.value) : null;
    
    if (dataFim && dataInicio >= dataFim) {
      this.error = 'Data de fim deve ser posterior à data de início';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const formData = this.servicoForm.value;
      
      const servicoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        unidadeId: parseInt(formData.unidadeId),
        tecnicoId: formData.tecnicoId ? parseInt(formData.tecnicoId) : undefined,
        dataInicio: new Date(formData.dataInicio),
        dataFim: formData.dataFim ? new Date(formData.dataFim) : undefined,
        tipoServico: formData.tipoServico,
        prioridade: formData.prioridade,
        episSelecionados: formData.episSelecionados,
        medidasControle: formData.medidasControle,
        observacoes: formData.observacoes
      };
      
      if (this.isEditMode && this.servicoId) {
        await this.servicoService.updateServico(this.servicoId, servicoData).toPromise();
        this.success = 'Serviço atualizado com sucesso!';
      } else {
        await this.servicoService.createServico(servicoData).toPromise();
        this.success = 'Serviço criado com sucesso!';
      }

      setTimeout(() => {
        this.router.navigate(['/servicos']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = this.isEditMode ? 'Erro ao atualizar serviço' : 'Erro ao criar serviço';
      }
      console.error('Erro ao salvar serviço:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched() {
    Object.keys(this.servicoForm.controls).forEach(key => {
      const control = this.servicoForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.servicoForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.servicoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  cancelar() {
    this.router.navigate(['/servicos']);
  }
}