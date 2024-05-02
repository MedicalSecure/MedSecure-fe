import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp4AddMedicationComponent } from './stp4-add-medication.component';

describe('Stp4AddMedicationComponent', () => {
  let component: Stp4AddMedicationComponent;
  let fixture: ComponentFixture<Stp4AddMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp4AddMedicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Stp4AddMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
