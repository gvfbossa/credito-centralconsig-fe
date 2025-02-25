import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConveniosSearchComponent } from './convenios-search.component';

describe('ConveniosSearchComponent', () => {
  let component: ConveniosSearchComponent;
  let fixture: ComponentFixture<ConveniosSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConveniosSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConveniosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
