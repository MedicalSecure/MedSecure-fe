import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp2MapMedicationsComponent } from './stp2-map-medications.component';

describe('Stp2MapMedicationsComponent', () => {
  let component: Stp2MapMedicationsComponent;
  let fixture: ComponentFixture<Stp2MapMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp2MapMedicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp2MapMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
