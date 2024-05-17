import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp1ImportMedicationsComponent } from './stp1-import-medications.component';

describe('Stp1ImportMedicationsComponent', () => {
  let component: Stp1ImportMedicationsComponent;
  let fixture: ComponentFixture<Stp1ImportMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp1ImportMedicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp1ImportMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
