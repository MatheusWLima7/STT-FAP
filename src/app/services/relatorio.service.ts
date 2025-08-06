import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Relatorio, AgendamentoRelatorio, CreateRelatorioRequest } from '../models/relatorio.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = 'http://localhost:3000/api/relatorios';

  constructor(private http: HttpClient) {}

  getRelatorios(): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(this.apiUrl);
  }

  createRelatorio(relatorio: CreateRelatorioRequest): Observable<Relatorio> {
    return this.http.post<Relatorio>(this.apiUrl, relatorio);
  }

  downloadRelatorio(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  getAgendamentos(): Observable<AgendamentoRelatorio[]> {
    return this.http.get<AgendamentoRelatorio[]>(`${this.apiUrl}/agendamentos`);
  }

  createAgendamento(agendamento: Partial<AgendamentoRelatorio>): Observable<AgendamentoRelatorio> {
    return this.http.post<AgendamentoRelatorio>(`${this.apiUrl}/agendamentos`, agendamento);
  }

  updateAgendamento(id: number, agendamento: Partial<AgendamentoRelatorio>): Observable<AgendamentoRelatorio> {
    return this.http.put<AgendamentoRelatorio>(`${this.apiUrl}/agendamentos/${id}`, agendamento);
  }

  deleteAgendamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/agendamentos/${id}`);
  }

  exportarDados(formato: 'EXCEL' | 'PDF', filtros: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/exportar`, { formato, filtros }, { responseType: 'blob' });
  }
}