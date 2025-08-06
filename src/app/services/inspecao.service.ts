import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inspecao, AgendaInspecao, CreateInspecaoRequest } from '../models/inspecao.model';

@Injectable({
  providedIn: 'root'
})
export class InspecaoService {
  private apiUrl = 'http://localhost:3000/api/inspecoes';

  constructor(private http: HttpClient) {}

  getInspecoes(): Observable<Inspecao[]> {
    return this.http.get<Inspecao[]>(this.apiUrl);
  }

  getInspecaoById(id: number): Observable<Inspecao> {
    return this.http.get<Inspecao>(`${this.apiUrl}/${id}`);
  }

  createInspecao(inspecao: CreateInspecaoRequest): Observable<Inspecao> {
    return this.http.post<Inspecao>(this.apiUrl, inspecao);
  }

  updateInspecao(id: number, inspecao: Partial<Inspecao>): Observable<Inspecao> {
    return this.http.put<Inspecao>(`${this.apiUrl}/${id}`, inspecao);
  }

  deleteInspecao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAgendaInspecoes(tecnicoId?: number): Observable<AgendaInspecao[]> {
    const url = tecnicoId ? `${this.apiUrl}/agenda?tecnicoId=${tecnicoId}` : `${this.apiUrl}/agenda`;
    return this.http.get<AgendaInspecao[]>(url);
  }

  getInspecoesByExtintor(extintorId: number): Observable<Inspecao[]> {
    return this.http.get<Inspecao[]>(`${this.apiUrl}/extintor/${extintorId}`);
  }

  getInspecoesByTecnico(tecnicoId: number): Observable<Inspecao[]> {
    return this.http.get<Inspecao[]>(`${this.apiUrl}/tecnico/${tecnicoId}`);
  }

  uploadFotos(inspecaoId: number, fotos: File[]): Observable<string[]> {
    const formData = new FormData();
    fotos.forEach(foto => formData.append('fotos', foto));
    return this.http.post<string[]>(`${this.apiUrl}/${inspecaoId}/fotos`, formData);
  }

  finalizarInspecao(id: number, dados: any): Observable<Inspecao> {
    return this.http.post<Inspecao>(`${this.apiUrl}/${id}/finalizar`, dados);
  }
}