import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionViewForPrescriptionToValidateComponent } from './prescription-view-for-prescription-to-validate.component';

describe('PrescriptionViewForPrescriptionToValidateComponent', () => {
  let component: PrescriptionViewForPrescriptionToValidateComponent;
  let fixture: ComponentFixture<PrescriptionViewForPrescriptionToValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionViewForPrescriptionToValidateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriptionViewForPrescriptionToValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
