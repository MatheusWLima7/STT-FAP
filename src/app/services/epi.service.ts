import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EPI, EPC, CreateEPIRequest } from '../models/epi.model';

@Injectable({
  providedIn: 'root'
})
export class EPIService {
  private apiUrl = 'http://localhost:3000/api/epis';

  constructor(private http: HttpClient) {}

  getEPIs(): Observable<EPI[]> {
    return this.http.get<EPI[]>(this.apiUrl);
  }

  getEPIById(id: number): Observable<EPI> {
    return this.http.get<EPI>(`${this.apiUrl}/${id}`);
  }

  createEPI(epi: CreateEPIRequest): Observable<EPI> {
    return this.http.post<EPI>(this.apiUrl, epi);
  }

  updateEPI(id: number, epi: Partial<EPI>): Observable<EPI> {
    return this.http.put<EPI>(`${this.apiUrl}/${id}`, epi);
  }

  deleteEPI(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEPIsByAtividade(atividade: string): Observable<EPI[]> {
    return this.http.get<EPI[]>(`${this.apiUrl}/atividade/${atividade}`);
  }

  getEPIsByPerigo(perigo: string): Observable<EPI[]> {
    return this.http.get<EPI[]>(`${this.apiUrl}/perigo/${perigo}`);
  }

  getEPCs(): Observable<EPC[]> {
    return this.http.get<EPC[]>(`${this.apiUrl}/epcs`);
  }

  createEPC(epc: Partial<EPC>): Observable<EPC> {
    return this.http.post<EPC>(`${this.apiUrl}/epcs`, epc);
  }
}