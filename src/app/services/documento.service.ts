import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento, PermissaoTrabalho, CreateDocumentoRequest } from '../models/documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl = 'http://localhost:3000/api/documentos';

  constructor(private http: HttpClient) {}

  getDocumentos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.apiUrl);
  }

  getDocumentoById(id: number): Observable<Documento> {
    return this.http.get<Documento>(`${this.apiUrl}/${id}`);
  }

  createDocumento(documento: CreateDocumentoRequest): Observable<Documento> {
    return this.http.post<Documento>(this.apiUrl, documento);
  }

  updateDocumento(id: number, documento: Partial<Documento>): Observable<Documento> {
    return this.http.put<Documento>(`${this.apiUrl}/${id}`, documento);
  }

  deleteDocumento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDocumentosVencidos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}/vencidos`);
  }

  getDocumentosVencimento(dias: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}/vencimento/${dias}`);
  }

  uploadArquivo(id: number, arquivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post(`${this.apiUrl}/${id}/arquivo`, formData);
  }

  downloadArquivo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/arquivo`, { responseType: 'blob' });
  }

  // Permissões de Trabalho
  getPTs(): Observable<PermissaoTrabalho[]> {
    return this.http.get<PermissaoTrabalho[]>(`${this.apiUrl}/pts`);
  }

  getPTsAbertas(): Observable<PermissaoTrabalho[]> {
    return this.http.get<PermissaoTrabalho[]>(`${this.apiUrl}/pts/abertas`);
  }

  getPTsExpiradas(): Observable<PermissaoTrabalho[]> {
    return this.http.get<PermissaoTrabalho[]>(`${this.apiUrl}/pts/expiradas`);
  }

  getPTsSuspensas(): Observable<PermissaoTrabalho[]> {
    return this.http.get<PermissaoTrabalho[]>(`${this.apiUrl}/pts/suspensas`);
  }

  createPT(pt: Partial<PermissaoTrabalho>): Observable<PermissaoTrabalho> {
    return this.http.post<PermissaoTrabalho>(`${this.apiUrl}/pts`, pt);
  }

  updatePT(id: number, pt: Partial<PermissaoTrabalho>): Observable<PermissaoTrabalho> {
    return this.http.put<PermissaoTrabalho>(`${this.apiUrl}/pts/${id}`, pt);
  }
}