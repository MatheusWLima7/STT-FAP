import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Extintor } from '../models/extintor.model';

@Injectable({
  providedIn: 'root'
})
export class ExtintorService {
  private apiUrl = 'http://localhost:3000/api/extintores';

  constructor(private http: HttpClient) {}

  getExtintores(): Observable<Extintor[]> {
    return this.http.get<Extintor[]>(this.apiUrl);
  }

  getExtintorById(id: number): Observable<Extintor> {
    return this.http.get<Extintor>(`${this.apiUrl}/${id}`);
  }

  createExtintor(extintor: Partial<Extintor>): Observable<Extintor> {
    return this.http.post<Extintor>(this.apiUrl, extintor);
  }

  updateExtintor(id: number, extintor: Partial<Extintor>): Observable<Extintor> {
    return this.http.put<Extintor>(`${this.apiUrl}/${id}`, extintor);
  }

  deleteExtintor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateQRCode(id: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${id}/qrcode`, {});
  }

  getExtintoresByUnidade(unidadeId: number): Observable<Extintor[]> {
    return this.http.get<Extintor[]>(`${this.apiUrl}/unidade/${unidadeId}`);
  }

  getExtintoresVencimento(dias: number): Observable<Extintor[]> {
    return this.http.get<Extintor[]>(`${this.apiUrl}/vencimento/${dias}`);
  }
}