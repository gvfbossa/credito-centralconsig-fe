import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { FormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIcon,
    CommonModule,
    RouterModule
  ],
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})

export class ClientesListComponent implements OnInit, OnChanges {
  @Input() clientes: any[] = []; // Recebe a lista filtrada ou toda a lista
  @Input() tipoAcoes: 'clientes' | 'contas' = 'clientes'; // Controle de tipo de ação (clientes ou contas)
  displayedColumns: string[] = ['cpf', 'nomeCompleto', 'acoes'];

  sortColumn: string = '';
  sortDirection: string = 'asc';

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild('tabela') tabela!: MatTable<any>;

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit() {
    this.dataSource.data = this.clientes;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clientes']) {
      this.dataSource.data = this.clientes;
    }
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.clientes.sort((a, b) => {
      const valueA = a[column].toLowerCase();
      const valueB = b[column].toLowerCase();

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.tabela.renderRows();
  }

  onEdit(cliente: any) {
    if (this.tipoAcoes === 'clientes') {
      this.router.navigate(['/clientes/cadastro/', cliente.cpf]); // Navega para a rota de edição com o ID do cliente
    }
    else {
      this.router.navigate(['/contas-bancarias/cadastro/', cliente.cpf]); // Navega para a rota de edição com o ID do cliente
    }
  }

  onDelete(cpf: number) {
    if (this.tipoAcoes === 'clientes' && confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(cpf).subscribe(() => {
        alert('Cliente excluído com sucesso!');
          this.loadClientes();
      });
    }
  }

  loadClientes() {
    this.clienteService.getAllClientes().subscribe(clientes => {
      this.clientes = clientes; // Atualiza a lista de clientes
      this.dataSource.data = clientes; // Atualiza a tabela do Material
      this.tabela.renderRows(); // Força a re-renderização da tabela
    });
  }
  
}
