import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notificacao, ConfiguracaoNotificacao, CreateNotificacaoRequest } from '../models/notificacao.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private apiUrl = 'http://localhost:3000/api/notificacoes';
  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  public notificacoes$ = this.notificacoesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarNotificacoes();
  }

  getNotificacoes(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(this.apiUrl);
  }

  getNotificacoesNaoLidas(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${this.apiUrl}/nao-lidas`);
  }

  createNotificacao(notificacao: CreateNotificacaoRequest): Observable<Notificacao> {
    return this.http.post<Notificacao>(this.apiUrl, notificacao);
  }

  marcarComoLida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/lida`, {});
  }

  marcarTodasComoLidas(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/marcar-todas-lidas`, {});
  }

  deleteNotificacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getConfiguracoes(): Observable<ConfiguracaoNotificacao[]> {
    return this.http.get<ConfiguracaoNotificacao[]>(`${this.apiUrl}/configuracoes`);
  }

  updateConfiguracao(id: number, config: Partial<ConfiguracaoNotificacao>): Observable<ConfiguracaoNotificacao> {
    return this.http.put<ConfiguracaoNotificacao>(`${this.apiUrl}/configuracoes/${id}`, config);
  }

  private carregarNotificacoes() {
    this.getNotificacoes().subscribe(notificacoes => {
      this.notificacoesSubject.next(notificacoes);
    });
  }

  atualizarNotificacoes() {
    this.carregarNotificacoes();
  }
}