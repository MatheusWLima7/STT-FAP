import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadeOperacional, ResponsavelUnidade, CreateUnidadeRequest } from '../models/unidade.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadeService {
  private apiUrl = 'http://localhost:3000/api/unidades';

  constructor(private http: HttpClient) {}

  getUnidades(): Observable<UnidadeOperacional[]> {
    return this.http.get<UnidadeOperacional[]>(this.apiUrl);
  }

  getUnidadeById(id: number): Observable<UnidadeOperacional> {
    return this.http.get<UnidadeOperacional>(`${this.apiUrl}/${id}`);
  }

  createUnidade(unidade: CreateUnidadeRequest): Observable<UnidadeOperacional> {
    return this.http.post<UnidadeOperacional>(this.apiUrl, unidade);
  }

  updateUnidade(id: number, unidade: Partial<UnidadeOperacional>): Observable<UnidadeOperacional> {
    return this.http.put<UnidadeOperacional>(`${this.apiUrl}/${id}`, unidade);
  }

  deleteUnidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getResponsaveis(unidadeId: number): Observable<ResponsavelUnidade[]> {
    return this.http.get<ResponsavelUnidade[]>(`${this.apiUrl}/${unidadeId}/responsaveis`);
  }

  createResponsavel(unidadeId: number, responsavel: Partial<ResponsavelUnidade>): Observable<ResponsavelUnidade> {
    return this.http.post<ResponsavelUnidade>(`${this.apiUrl}/${unidadeId}/responsaveis`, responsavel);
  }

  updateResponsavel(unidadeId: number, responsavelId: number, responsavel: Partial<ResponsavelUnidade>): Observable<ResponsavelUnidade> {
    return this.http.put<ResponsavelUnidade>(`${this.apiUrl}/${unidadeId}/responsaveis/${responsavelId}`, responsavel);
  }

  deleteResponsavel(unidadeId: number, responsavelId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${unidadeId}/responsaveis/${responsavelId}`);
  }
}