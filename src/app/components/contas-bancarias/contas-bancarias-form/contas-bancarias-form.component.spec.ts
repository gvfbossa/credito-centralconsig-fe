import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasBancariasFormComponent } from './contas-bancarias-form.component';

describe('ContasBancariasFormComponent', () => {
  let component: ContasBancariasFormComponent;
  let fixture: ComponentFixture<ContasBancariasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContasBancariasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasBancariasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
