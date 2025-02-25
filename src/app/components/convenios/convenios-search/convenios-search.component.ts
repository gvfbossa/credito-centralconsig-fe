import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-convenios-search',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon
  ],
  templateUrl: './convenios-search.component.html',
  styleUrls: ['./convenios-search.component.css']
})
export class ConveniosSearchComponent {
  searchQuery: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  onSearch() {
    this.searchEvent.emit(this.searchQuery);
  }
}
