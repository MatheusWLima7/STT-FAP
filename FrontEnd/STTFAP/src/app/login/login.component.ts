import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.senha) {
      this.error = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.senha)
      .subscribe({
        next: (res) => {
          console.log('Login realizado com sucesso!', res);
          
          // Redirecionar baseado no tipo de usuário
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/menu']);
          }
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
          this.error = 'Email ou senha inválidos';
          this.loading = false;
        }
      });
  }
}
