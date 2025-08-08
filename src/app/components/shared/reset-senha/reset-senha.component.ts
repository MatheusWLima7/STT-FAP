import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-senha.component.html',
  styleUrl: './reset-senha.component.css'
})
export class ResetSenhaComponent {
  email: string = '';
  loading: boolean = false;
  success: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email) {
      this.error = 'Digite seu e-mail';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.resetPassword(this.email).subscribe({
      next: () => {
        this.success = 'Instruções enviadas para seu e-mail!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.error = 'Erro ao enviar e-mail de recuperação';
        console.error('Erro ao resetar senha:', err);
        this.loading = false;
      }
    });
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}