import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ConvenioService } from '../../../services/convenio.service';

@Component({
  selector: 'app-convenios-list',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIcon,
    CommonModule,
    RouterModule
  ],
  templateUrl: './convenios-list.component.html',
  styleUrls: ['./convenios-list.component.css']
})

export class ConveniosListComponent implements OnInit, OnChanges {
  @Input() convenios: any[] = []; // Recebe a lista filtrada ou toda a lista
  displayedColumns: string[] = ['codigo', 'descricao', 'descricaoEmpregador', 'descricaoOrgao', 'fechamento', 'vencimento', 'acoes'];

  sortColumn: string = '';
  sortDirection: string = 'asc';

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild('tabela') tabela!: MatTable<any>;

  constructor(private convenioService: ConvenioService, private router: Router) {}

  ngOnInit() {
    this.dataSource.data = this.convenios;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['convenios']) {
      this.dataSource.data = this.convenios;
    }
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.convenios.sort((a, b) => {
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

  onEdit(convenio: any) {
      this.router.navigate(['/convenios/cadastro/', convenio])
  }

  onDelete(codigo: number) {
    const convenio = this.convenios.find(convenio => codigo === convenio.codigo);
    console.log('convenio? ', convenio)
    const confirmacao = confirm('Tem certeza que deseja remover o Convênio: ' + convenio.descricao + '?');
    
    if (confirmacao) {
      let removido = false
      this.convenioService.deleteConvenio(convenio.codigo).subscribe({
        next: (response) => {
          console.log('Convênio removida com sucesso:', response);
          alert('Convênio removido com sucesso!')
          this.loadConvenios()
        },
        error: (error) => {
          console.error('Erro ao remover convenio:', error);
          alert('Erro ao remover Convênio. Provavelmente existem Contas Bancárias associadas a este Convênio. Primeiro remova-as para depois excluir o Convênio com segurança');
        }
      });
    }
  }

  loadConvenios() {
    this.convenioService.getAllConvenios().subscribe(convenios => {
      this.convenios = convenios.map((item: { convenio: any; }) => item.convenio)
      this.dataSource.data = convenios.map((item: { convenio: any; }) => item.convenio)
      this.tabela.renderRows();
    });
  }
  
}
 