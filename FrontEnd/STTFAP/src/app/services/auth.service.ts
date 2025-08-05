import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(map(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.tipoUsuario === 'ADMIN';
  }

  isTecnico(): boolean {
    const user = this.currentUserValue;
    return user?.tipoUsuario === 'TECNICO';
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { email });
  }

  changePassword(senhaAtual: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      senhaAtual,
      novaSenha
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}