import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ClientesSearchComponent } from './clientes-search/clientes-search.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ClientesSearchComponent,
    ClientesListComponent,
    RouterModule,
    MatIcon
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit() {
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
