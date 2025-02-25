import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnumsResponse } from '../models/enums-response.model';
import { environment
  
 } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/cliente`;
  private apiUrlEnums = `${environment.apiUrl}/enums`;
  private apiUrlBancos = `${environment.apiUrl}/banco`;
  private apiUrlConvenios = `${environment.apiUrl}/convenio`;

  constructor(private http: HttpClient) {}

  // Obtém todos os clientes do backend
  getAllClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/simplificado`);
  }

  // Obtém um cliente pelo ID
  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Obtém um cliente pelo CPF
  getClienteByCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${cpf}`);
  }

  // Salva um novo cliente
  salvarCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, cliente);
  }

  // Atualiza um cliente pelo CPF
  updateCliente(cpf: string, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cpf}`, cliente);
  }

  // Deleta um cliente pelo ID
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtém enums
  getEnums(): Observable<EnumsResponse> {
    return this.http.get<EnumsResponse>(`${this.apiUrlEnums}`);
  }

  // Obtém bancos
  getBancos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlBancos}`);
  }

  // Obtém convênios
  getConvenios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlConvenios}`);
  }
}
