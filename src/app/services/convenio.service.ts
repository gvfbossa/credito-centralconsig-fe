import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {
  convenios: any[] = []
    
  apiUrl: string = 'http://localhost:8080/api/convenio';
  
  constructor(private http: HttpClient) {}
  
    getAllConvenios(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}`);
    }

    deleteConvenio(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
   
    getConvenioByCodigo(codigo: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${codigo}`);
    }

    salvarConvenio(convenio: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}`, convenio);
    }

    atualizarConvenio(convenio: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${convenio.codigo}`, convenio)
    }

}
