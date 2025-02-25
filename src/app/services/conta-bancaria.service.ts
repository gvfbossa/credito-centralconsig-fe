import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContaBancariaService {
  private apiUrl = `${environment.apiUrl}/conta-bancaria`;

  constructor(private http: HttpClient) {}

  updateContas(cpf: string, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cpf}`, cliente);
  }

  syncContas(cpfParam: string, contasBancarias: any[]) {
    return this.http.put<any>(`${this.apiUrl}/${cpfParam}/sync`, contasBancarias);
  }

  removeConta(conta: any) {
    return this.http.delete<any>(`${this.apiUrl}`, { body: conta });
  }

}
