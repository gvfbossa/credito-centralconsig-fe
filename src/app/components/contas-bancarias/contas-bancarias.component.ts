import { Component, OnInit } from '@angular/core';
import { ClientesListComponent } from '../clientes/clientes-list/clientes-list.component';
import { ClientesSearchComponent } from '../clientes/clientes-search/clientes-search.component';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contas-bancarias',
  standalone: true,
  imports: [
    ClientesListComponent,
    ClientesSearchComponent,
    RouterModule
  ], 
  templateUrl: './contas-bancarias.component.html',
  styleUrl: './contas-bancarias.component.css'
})

export class ContasBancariasComponent implements OnInit {

  clientes: any[] = [];
  clientesFiltrados: any[] = []; 

  constructor(private clienteService: ClienteService, private router: Router) {}
 
  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.getAllClientes().subscribe((data: any) => {
      this.clientes = data;
      this.clientesFiltrados = data; // Inicializa a lista filtrada com todos os clientes
    });
  }

  onSearch(query: string) {
    if (query) {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nomeCompleto.toLowerCase().includes(query.toLowerCase()) ||
        cliente.cpf.includes(query)
      );
    } else {
      this.clientesFiltrados = [...this.clientes]; // Reseta a lista filtrada
    }
  }

}
