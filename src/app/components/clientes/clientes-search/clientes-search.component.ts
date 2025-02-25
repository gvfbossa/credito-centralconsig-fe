import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-clientes-search',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon
  ],
  templateUrl: './clientes-search.component.html',
  styleUrls: ['./clientes-search.component.css']
})
export class ClientesSearchComponent {
  searchQuery: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  onSearch() {
    this.searchEvent.emit(this.searchQuery);
  }
}
