import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContaBancariaService {
  private apiUrl = 'http://localhost:8080/api/conta-bancaria';

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
