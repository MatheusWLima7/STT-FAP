import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InspecaoService } from '../../../services/inspecao.service';
import { ExtintorService } from '../../../services/extintor.service';
import { AuthService } from '../../../services/auth.service';
import { Inspecao, ChecklistInspecao } from '../../../models/inspecao.model';
import { Extintor } from '../../../models/extintor.model';

@Component({
  selector: 'app-checklist-inspecao',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checklist-inspecao.component.html',
  styleUrl: './checklist-inspecao.component.css'
})
export class ChecklistInspecaoComponent implements OnInit {
  checklistForm: FormGroup;
  inspecaoId?: number;
  extintor?: Extintor;
  loading: boolean = false;
  error: string = '';
  success: string = '';

  checklistItems: ChecklistInspecao[] = [
    {
      id: 1,
      item: 'Extintor está em local visível e sinalizado',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Localização'
    },
    {
      id: 2,
      item: 'Acesso ao extintor está desobstruído',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Localização'
    },
    {
      id: 3,
      item: 'Extintor está fixado adequadamente',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Instalação'
    },
    {
      id: 4,
      item: 'Altura de instalação está correta (1,60m)',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Instalação'
    },
    {
      id: 5,
      item: 'Manômetro indica pressão adequada',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Pressão'
    },
    {
      id: 6,
      item: 'Não há vazamentos visíveis',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Integridade'
    },
    {
      id: 7,
      item: 'Corpo do extintor sem danos ou corrosão',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Integridade'
    },
    {
      id: 8,
      item: 'Mangueira e esguicho em bom estado',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Acessórios'
    },
    {
      id: 9,
      item: 'Lacre de segurança íntegro',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Segurança'
    },
    {
      id: 10,
      item: 'Etiqueta de identificação legível',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Identificação'
    },
    {
      id: 11,
      item: 'Data de validade dentro do prazo',
      conforme: false,
      observacao: '',
      obrigatorio: true,
      categoria: 'Validade'
    },
    {
      id: 12,
      item: 'Peso do extintor adequado',
      conforme: false,
      observacao: '',
      obrigatorio: false,
      categoria: 'Verificação'
    }
  ];

  fotosUpload: File[] = [];
  previewFotos: string[] = [];
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private inspecaoService: InspecaoService,
    private extintorService: ExtintorService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.checklistForm = this.createForm();
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inspecaoId = +params['id'];
        this.loadInspecao();
      }
    });
  }

  createForm(): FormGroup {
    const group: any = {
      observacoesGerais: ['', Validators.maxLength(1000)],
      resultado: ['', Validators.required]
    };

    // Adicionar controles para cada item do checklist
    this.checklistItems.forEach(item => {
      group[`item_${item.id}_conforme`] = [false];
      group[`item_${item.id}_observacao`] = [''];
    });

    return this.fb.group(group);
  }

  async loadInspecao() {
    if (!this.inspecaoId) return;

    this.loading = true;
    try {
      const inspecao = await this.inspecaoService.getInspecaoById(this.inspecaoId).toPromise();
      if (inspecao) {
        // Carregar dados do extintor
        this.extintor = await this.extintorService.getExtintorById(inspecao.extintorId).toPromise();
        
        // Se já existe checklist, preencher o formulário
        if (inspecao.checklist && inspecao.checklist.length > 0) {
          inspecao.checklist.forEach(item => {
            this.checklistForm.patchValue({
              [`item_${item.id}_conforme`]: item.conforme,
              [`item_${item.id}_observacao`]: item.observacao || ''
            });
          });
        }

        if (inspecao.observacoes) {
          this.checklistForm.patchValue({
            observacoesGerais: inspecao.observacoes
          });
        }

        if (inspecao.resultado) {
          this.checklistForm.patchValue({
            resultado: inspecao.resultado
          });
        }
      }
    } catch (error) {
      this.error = 'Erro ao carregar dados da inspeção';
      console.error('Erro ao carregar inspeção:', error);
    } finally {
      this.loading = false;
    }
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB
          this.fotosUpload.push(file);
          
          // Criar preview
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewFotos.push(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Arquivo muito grande. Máximo 5MB por foto.');
        }
      } else {
        alert('Apenas arquivos de imagem são permitidos.');
      }
    });
  }

  removerFoto(index: number) {
    this.fotosUpload.splice(index, 1);
    this.previewFotos.splice(index, 1);
  }

  calcularResultado() {
    let conformes = 0;
    let obrigatoriosNaoConformes = 0;

    this.checklistItems.forEach(item => {
      const conforme = this.checklistForm.get(`item_${item.id}_conforme`)?.value;
      if (conforme) {
        conformes++;
      } else if (item.obrigatorio) {
        obrigatoriosNaoConformes++;
      }
    });

    let resultado = '';
    if (obrigatoriosNaoConformes > 0) {
      resultado = 'NAO_CONFORME';
    } else if (conformes === this.checklistItems.length) {
      resultado = 'CONFORME';
    } else {
      resultado = 'MANUTENCAO_NECESSARIA';
    }

    this.checklistForm.patchValue({ resultado });
  }

  async onSubmit() {
    if (this.checklistForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      // Preparar dados do checklist
      const checklistData = this.checklistItems.map(item => ({
        ...item,
        conforme: this.checklistForm.get(`item_${item.id}_conforme`)?.value || false,
        observacao: this.checklistForm.get(`item_${item.id}_observacao`)?.value || ''
      }));

      const dadosInspecao = {
        status: 'CONCLUIDA',
        dataRealizada: new Date(),
        resultado: this.checklistForm.get('resultado')?.value,
        observacoes: this.checklistForm.get('observacoesGerais')?.value,
        checklist: checklistData
      };

      // Finalizar inspeção
      await this.inspecaoService.finalizarInspecao(this.inspecaoId!, dadosInspecao).toPromise();

      // Upload das fotos se houver
      if (this.fotosUpload.length > 0) {
        await this.inspecaoService.uploadFotos(this.inspecaoId!, this.fotosUpload).toPromise();
      }

      this.success = 'Inspeção finalizada com sucesso!';
      
      setTimeout(() => {
        this.router.navigate(['/inspecoes']);
      }, 2000);

    } catch (error: any) {
      if (error.error?.message) {
        this.error = error.error.message;
      } else {
        this.error = 'Erro ao finalizar inspeção';
      }
      console.error('Erro ao finalizar inspeção:', error);
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched() {
    Object.keys(this.checklistForm.controls).forEach(key => {
      const control = this.checklistForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checklistForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  cancelar() {
    this.router.navigate(['/inspecoes']);
  }

  obterCategorias(): string[] {
    return [...new Set(this.checklistItems.map(item => item.categoria))];
  }

  getItensPorCategoria(categoria: string): ChecklistInspecao[] {
    return this.checklistItems.filter(item => item.categoria === categoria);
  }
}