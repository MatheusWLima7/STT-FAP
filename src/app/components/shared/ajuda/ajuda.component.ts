import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajuda.component.html',
  styleUrl: './ajuda.component.css'
})
export class AjudaComponent implements OnInit {
  secaoSelecionada: string = 'faq';
  termoBusca: string = '';
  
  faqItems = [
    {
      categoria: 'Login e Acesso',
      pergunta: 'Como faço login no sistema?',
      resposta: 'Use seu email e senha fornecidos pelo administrador. Se esqueceu a senha, clique em "Esqueci minha senha" na tela de login.',
      tags: ['login', 'senha', 'acesso']
    },
    {
      categoria: 'Login e Acesso',
      pergunta: 'Esqueci minha senha, como recuperar?',
      resposta: 'Na tela de login, clique em "Esqueci minha senha", digite seu email e siga as instruções enviadas por email.',
      tags: ['senha', 'recuperar', 'email']
    },
    {
      categoria: 'Extintores',
      pergunta: 'Como cadastrar um novo extintor?',
      resposta: 'Acesse o menu "Extintores" > "Novo Extintor", preencha todos os campos obrigatórios e clique em "Criar Extintor".',
      tags: ['extintor', 'cadastro', 'novo']
    },
    {
      categoria: 'Extintores',
      pergunta: 'Como gerar o QR Code de um extintor?',
      resposta: 'Na lista de extintores, clique no ícone "📱" do extintor desejado ou acesse a edição do extintor e clique em "Gerar QR Code".',
      tags: ['qr code', 'extintor', 'código']
    },
    {
      categoria: 'Inspeções',
      pergunta: 'Como realizar uma inspeção?',
      resposta: 'Acesse "Agenda de Inspeções", encontre a inspeção agendada e clique em "Realizar". Preencha o checklist e adicione fotos se necessário.',
      tags: ['inspeção', 'checklist', 'realizar']
    },
    {
      categoria: 'Inspeções',
      pergunta: 'Posso adicionar fotos durante a inspeção?',
      resposta: 'Sim! Durante o preenchimento do checklist, há uma seção específica para upload de fotos. Máximo 5MB por foto.',
      tags: ['fotos', 'inspeção', 'upload']
    },
    {
      categoria: 'Relatórios',
      pergunta: 'Como gerar um relatório?',
      resposta: 'Acesse "Relatórios", selecione o tipo desejado, configure os filtros e clique em "Gerar Relatório". O arquivo será baixado automaticamente.',
      tags: ['relatório', 'gerar', 'pdf']
    },
    {
      categoria: 'Usuários',
      pergunta: 'Como criar um novo usuário? (Admin)',
      resposta: 'Acesse "Gestão de Usuários" > "Novo Usuário", preencha os dados e defina o tipo de perfil (Admin ou Técnico).',
      tags: ['usuário', 'criar', 'admin']
    },
    {
      categoria: 'Unidades',
      pergunta: 'Como cadastrar uma nova unidade? (Admin)',
      resposta: 'Acesse "Unidades Operacionais" > "Nova Unidade", preencha as informações da unidade e defina o tipo (Filial, Setor ou Obra).',
      tags: ['unidade', 'cadastro', 'filial']
    },
    {
      categoria: 'Serviços',
      pergunta: 'Como criar um serviço? (Admin)',
      resposta: 'Acesse "Gestão de Serviços" > "Novo Serviço", defina o escopo, selecione o técnico, EPIs necessários e medidas de controle.',
      tags: ['serviço', 'criar', 'técnico']
    }
  ];

  faqFiltrado = this.faqItems;

  tutoriais = [
    {
      titulo: 'Primeiros Passos no Sistema',
      descricao: 'Aprenda a navegar pelo sistema e realizar as principais operações.',
      duracao: '5 min',
      icone: '🚀'
    },
    {
      titulo: 'Como Realizar uma Inspeção Completa',
      descricao: 'Passo a passo para realizar inspeções de extintores com checklist e fotos.',
      duracao: '8 min',
      icone: '🔍'
    },
    {
      titulo: 'Gerando Relatórios Eficientes',
      descricao: 'Como configurar filtros e gerar relatórios personalizados.',
      duracao: '6 min',
      icone: '📊'
    },
    {
      titulo: 'Configurações do Sistema (Admin)',
      descricao: 'Como configurar parâmetros, notificações e backup do sistema.',
      duracao: '10 min',
      icone: '⚙️'
    }
  ];

  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.filtrarFAQ();
  }

  selecionarSecao(secao: string) {
    this.secaoSelecionada = secao;
  }

  filtrarFAQ() {
    if (!this.termoBusca.trim()) {
      this.faqFiltrado = this.faqItems;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.faqFiltrado = this.faqItems.filter(item => 
      item.pergunta.toLowerCase().includes(termo) ||
      item.resposta.toLowerCase().includes(termo) ||
      item.tags.some(tag => tag.toLowerCase().includes(termo)) ||
      item.categoria.toLowerCase().includes(termo)
    );
  }

  abrirTutorial(tutorial: any) {
    alert(`Tutorial "${tutorial.titulo}" será aberto em breve!`);
  }

  entrarContato() {
    const email = 'suporte@sttfap.com';
    const assunto = 'Suporte STT-FAP';
    const corpo = `Olá,\n\nPreciso de ajuda com o sistema STT-FAP.\n\nUsuário: ${this.currentUser?.nome}\nEmail: ${this.currentUser?.email}\n\nDescreva sua dúvida aqui:\n\n`;
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.open(mailtoLink);
  }

  abrirChat() {
    alert('Chat de suporte será implementado em breve!');
  }

  voltar() {
    this.router.navigate(['/menu']);
  }

  obterCategorias(): string[] {
    return [...new Set(this.faqFiltrado.map(item => item.categoria))];
  }

  getFAQPorCategoria(categoria: string): any[] {
    return this.faqFiltrado.filter(item => item.categoria === categoria);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}