import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../models/servico.model';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = 'http://localhost:3000/api/servicos';

  constructor(private http: HttpClient) {}

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  getServicoById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  createServico(servico: Partial<Servico>): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  updateServico(id: number, servico: Partial<Servico>): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, servico);
  }

  deleteServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getServicosByTecnico(tecnicoId: number): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/tecnico/${tecnicoId}`);
  }

  designarTecnico(servicoId: number, tecnicoId: number): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}/${servicoId}/designar`, { tecnicoId });
  }

  solicitarProrrogacao(servicoId: number, dados: any): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}/${servicoId}/prorrogar`, dados);
  }

  encerrarServico(servicoId: number, dados: any): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}/${servicoId}/encerrar`, dados);
  }

  validarServico(servicoId: number): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}/${servicoId}/validar`, {});
  }
}