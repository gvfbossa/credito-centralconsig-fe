import { Component, OnInit } from '@angular/core';
import { ConveniosSearchComponent } from './convenios-search/convenios-search.component';
import { ConveniosListComponent } from './convenios-list/convenios-list.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ConvenioService } from '../../services/convenio.service';

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [
    ConveniosSearchComponent,
    ConveniosListComponent,
    RouterModule,
    MatIcon
  ],
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css']
})
export class ConveniosComponent implements OnInit {

  convenios: any[] = [];
  conveniosFiltrados: any[] = [];

  constructor(private convenioService: ConvenioService, private router: Router) {}

  ngOnInit() {
    this.carregarConvenios();
  }

  carregarConvenios() {
    this.convenioService.getAllConvenios().subscribe((data: any) => {
      this.convenios = data.map((item: { convenio: any; }) => item.convenio); // Extraindo apenas o objeto dentro de "convenio"
      this.conveniosFiltrados = [...this.convenios];
    })
  }
  

  onSearch(query: string) {
    if (query) {
      this.conveniosFiltrados = this.convenios.filter(convenio =>
        convenio.descricao.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.conveniosFiltrados = [...this.convenios]; // Reseta a lista filtrada
    }
  }

}
