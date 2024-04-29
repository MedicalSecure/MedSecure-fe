import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribeMedicationComponent } from './stp4-add-medication.component';

describe('PrescribeMedicationComponent', () => {
  let component: PrescribeMedicationComponent;
  let fixture: ComponentFixture<PrescribeMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescribeMedicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescribeMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
