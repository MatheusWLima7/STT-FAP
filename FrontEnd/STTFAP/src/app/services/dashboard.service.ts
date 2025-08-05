import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardMetrics, AlertaCritico, InspecaoPorPeriodo, PerformanceTecnico } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getMetrics(filtros?: any): Observable<DashboardMetrics> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/metrics`, { params });
  }

  getAlertasCriticos(): Observable<AlertaCritico[]> {
    return this.http.get<AlertaCritico[]>(`${this.apiUrl}/alertas-criticos`);
  }

  getInspecoesPorPeriodo(filtros?: any): Observable<InspecaoPorPeriodo[]> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<InspecaoPorPeriodo[]>(`${this.apiUrl}/inspecoes-periodo`, { params });
  }

  getPerformanceTecnicos(filtros?: any): Observable<PerformanceTecnico[]> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<PerformanceTecnico[]>(`${this.apiUrl}/performance-tecnicos`, { params });
  }

  exportarDashboard(formato: 'PDF' | 'EXCEL', filtros?: any): Observable<Blob> {
    const params = { ...filtros, formato: formato.toLowerCase() };
    return this.http.post(`${this.apiUrl}/exportar`, params, {
      responseType: 'blob'
    });
  }
}