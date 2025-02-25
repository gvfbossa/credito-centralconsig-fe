import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnumsResponse } from '../models/enums-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/cliente';
  private apiUrlEnums = 'http://localhost:8080/api/enums'
  private apiUrlBancos = 'http://localhost:8080/api/banco';
  private apiUrlConvenios = 'http://localhost:8080/api/convenio';

  constructor(private http: HttpClient) {}

  // Obtém todos os clientes do backend
  getAllClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/simplificado`);
  }

  // Obtém um cliente pelo ID (Agora chama o backend)
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

  getEnums(): Observable<EnumsResponse> {
    return this.http.get<EnumsResponse>(`${this.apiUrlEnums}`);
  }

  getBancos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlBancos}`)
  }

  getConvenios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlConvenios}`)
  }

}
