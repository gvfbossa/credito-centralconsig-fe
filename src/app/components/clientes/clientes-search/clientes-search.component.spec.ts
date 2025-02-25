import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesSearchComponent } from './clientes-search.component';

describe('ClientesSearchComponent', () => {
  let component: ClientesSearchComponent;
  let fixture: ComponentFixture<ClientesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
